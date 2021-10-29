<?php

namespace Dibs\Controllers;

use WP_Error;

use Dibs\Dibs;

class BaseController {
	const TABLE = null;
	const COLUMNS = [];
	const REQUIRED = [];
	const DELETED_AT_COLUMN = null;

	const JSON_COLUMNS = [];
	const BOOLEAN_COLUMNS = [];
	const ORDER_BY = 'id desc';

	public static function handleRequest($request) {
		switch ($request->get_method()) {
		case 'GET':
			return static::get($request);
		case 'POST':
			return static::post($request);
		}
	}

	public static function handleSingleRequest($request) {
		switch ($request->get_method()) {
		case 'GET':
			return static::getOne($request);
		case 'PATCH':
			return static::patch($request);
		case 'DELETE':
			return static::delete($request);
		}
	}

	static function getParams($params, $includeId = false) {
		return
			array_map(
				function ($val) {
					if (is_array($val)) {
						return json_encode($val);
					}

					if (is_bool($val)) {
						return $val ? 1 : 0;
					}

					if (is_int($val) || is_float($val)) {
						return $val;
					}

					if (is_numeric($val)) {
						return strpos($val, '.') === false ? intval($val) : floatval($val);
					}

					if (empty($val)) return null;

					return $val;
				},
				array_filter(
					$params,
					function ($key) use ($includeId) {
						if ($includeId && $key === 'id') return true;

						return in_array($key, static::COLUMNS);
					},
					ARRAY_FILTER_USE_KEY
				)
			);
	}

	static function decodeJsonCols(&$row) {
		foreach ($row as $key => $val) {
			if (in_array($key, static::JSON_COLUMNS))
				$row[$key] = json_decode($val);
		}

		return $row;
	}

	static function whereClauses($params) {
		return array_map(function($key, $val) {
			$placeholder = is_numeric($val) ? '%d' : '%s';
			return "{$key} = {$placeholder}";
		}, array_keys($params), $params);
	}

	public static function get($request, $whereClauses = [], $whereValues = []) {
		global $wpdb;

		$table = Dibs::getTableName(static::TABLE);

		$query = "SELECT * FROM {$table}";

		$params = $request->get_params();
		$whereParams = static::getParams($params, true);
		$whereClauses = array_merge($whereClauses, static::whereClauses($whereParams));
		$whereValues = array_merge($whereValues, array_values($whereParams));

		if (!empty(static::DELETED_AT_COLUMN)) {
			$whereClauses[] = static::DELETED_AT_COLUMN . ' IS NULL';
		}

		if (!empty($whereClauses)) {
			$query .= ' WHERE ' . implode(' AND ', $whereClauses);
		}

		if (!empty(static::ORDER_BY)) {
			$query .= ' ORDER BY ' . static::ORDER_BY;
		}

		if (!empty($params['limit']) && is_numeric($params['limit'])) {
			$query .= ' limit %d';
			$whereValues[] = $params['limit'];
		}

		if (!empty($params['offset']) && is_numeric($params['offset'])) {
			$query .= ' offset %d';
			$whereValues[] = $params['offset'];
		}

		if (!empty($whereClauses)) {
			$query = $wpdb->prepare($query, $whereValues);
		}

		$results = $wpdb->get_results($query, ARRAY_A);


		if (!empty(static::JSON_COLUMNS)) {
			foreach ($results as &$row) {
				self::decodeJsonCols($row);
			}
		}

		return $results;
	}

	public static function getOne($request) {
		global $wpdb;

		$table = Dibs::getTableName(static::TABLE);

		$id = $request->get_param('id');

		if (empty($id)) {
			return new WP_Error('missing_params', 'Missing required parameters', ['status' => 400]);
		}

		$query = "SELECT * FROM {$table} WHERE id = %d";
		$result = $wpdb->get_row($wpdb->prepare($query, $id), ARRAY_A);

		if (!empty($result))
			return self::decodeJsonCols($result);

		return new WP_Error('not-found', 'Not found', ['status' => 404]);
	}

	public static function post($request) {
		global $wpdb;

		$user = wp_get_current_user();
		if (!$user->has_cap(Dibs::ADMIN_CAP))
			return new WP_Error('unauthorized', 'Unauthorized', ['status' => 403]);

		$params = static::getParams($request->get_params());
		foreach (static::REQUIRED as $param) {
			if (empty($params[$param])) {
				return new WP_Error('missing_params', 'Missing required parameters', ['status' => 400]);
			}
		}

		$table = Dibs::getTableName(static::TABLE);
		$wpdb->insert($table, $params);

		$query = "SELECT * FROM {$table} WHERE id = %d";
		return self::decodeJsonCols($wpdb->get_row($wpdb->prepare($query, [$wpdb->insert_id]), ARRAY_A));
	}

	public static function patch($request) {
		global $wpdb;

		$user = wp_get_current_user();
		if (!$user->has_cap(Dibs::ADMIN_CAP))
			return new WP_Error('unauthorized', 'Unauthorized', ['status' => 403]);

		$id = $request->get_param('id');

		if (empty($id)) {
			return new WP_Error('missing_params', 'Missing required parameters', ['status' => 400]);
		}

		$table = Dibs::getTableName(static::TABLE);
		$wpdb->update(
			$table,
			static::getParams($request->get_params()),
			['id' => $id]
		);

		$query = "SELECT * FROM {$table} WHERE id = %d";
		return self::decodeJsonCols($wpdb->get_row($wpdb->prepare($query, [$id]), ARRAY_A));
	}

	public static function delete($request) {
		global $wpdb;

		$user = wp_get_current_user();
		if (!$user->has_cap(Dibs::ADMIN_CAP))
			return new WP_Error('unauthorized', 'Unauthorized', ['status' => 403]);

		$id = $request->get_param('id');
		if (empty($id))
			return new WP_Error('missing_params', 'Missing required parameters', ['status' => 400]);

		$table = Dibs::getTableName(static::TABLE);

		if (!empty(static::DELETED_AT_COLUMN)) {
			$wpdb->update($table, [static::DELETED_AT_COLUMN => date('c')], ['id' => $id]);
		} else {
			$wpdb->delete($table, ['id' => $id]);
		}
	}
}
