<?php

namespace Dibs\Controllers;

require_once('BaseController.php');

use Dibs\Dibs;

use WP_Error;

class ReservationsController extends BaseController {
	const TABLE = 'reservations';
	const COLUMNS = [
		'user_id',
		'resource_id',
		'reservation_start',
		'reservation_end',
		'description',
		'status',
	];
	const REQUIRED = [
		'user_id',
		'resource_id',
		'reservation_start',
		'reservation_end',
	];
	const ORDER_BY = 'reservation_start DESC';
	const DELETED_AT_COLUMN = 'deleted_at';

	public static function get($request, $whereClauses = [], $whereValues = []) {
		if (!empty($request->get_param('after'))) {
			$whereClauses[] = 'reservation_end >= %s';
			$whereValues[] = $request->get_param('after');
		}

		if (!empty($request->get_param('before'))) {
			$whereClauses[] = 'reservation_start <= %s';
			$whereValues[] = $request->get_param('before');
		}

		return parent::get($request, $whereClauses, $whereValues);
	}

	public static function post($request) {
		global $wpdb;

		$params = static::getParams($request->get_params());
		$user = wp_get_current_user();
		$params['user_id'] = $user->ID;
		$params['status'] = 'submitted';

		if (!self::canReserve($user, $params['resource_id']))
			return new WP_Error('unauthorized', 'Unauthorized', ['status' => 403]);

		foreach (static::REQUIRED as $param) {
			if (empty($params[$param])) {
				return new WP_Error('missing_params', 'Missing required parameters', ['status' => 400]);
			}
		}

		if (self::alreadyBooked($params['resource_id'], $params['reservation_start'], $params['reservation_end']))
			return new WP_Error('taken', 'Already booked', ['status' => 403]);


		$table = Dibs::getTableName(static::TABLE);
		$wpdb->insert($table, $params);

		$query = "SELECT * FROM {$table} WHERE id = %d";
		return self::decodeJsonCols($wpdb->get_row($wpdb->prepare($query, [$wpdb->insert_id]), ARRAY_A));
	}

	static function alreadyBooked($resourceId, $start, $end) {
		global $wpdb;

		$reservations = Dibs::getTableName(static::TABLE);

		$query = "select count(id) as existing from {$reservations}
			where resource_id = %d and reservation_start < %s and reservation_end > %s";

		$result = $wpdb->get_row($wpdb->prepare($query, [$resourceId, $end, $start]), ARRAY_A);

		return $result['existing'] > 0;
	}

	static function canReserve($user, $resourceId) {
		if ($user->has_cap(Dibs::ADMIN_CAP)) return true;

		global $wpdb;

		$reservers = Dibs::getTableName('reserver_roles');

		$query = "select role from {$reservers} where resource_id = %d";
		$roles = $wpdb->get_results($wpdb->prepare($query, $resourceId), ARRAY_A);
		foreach ($roles as $role) {
			if ($user->has_cap($role)) return true;
		}

		return false;
	}

}
