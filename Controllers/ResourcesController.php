<?php

namespace Dibs\Controllers;

require_once('BaseController.php');

use Dibs\Dibs;

use WP_Error;

class ResourcesController extends BaseController {
	const TABLE = 'resources';
	const COLUMNS = [
		'name',
		'description',
		'image',
	];
	const REQUIRED = [
		'name'
	];
	const ORDER_BY = 'name asc';

	public static function getOne($request) {
		$resource = parent::getOne($request);

		if (!($resource instanceof WP_Error)) {
			$user = wp_get_current_user();

			$resource['can_reserve'] = false;

			if ($user->has_cap(Dibs::ADMIN_CAP)) {
				$resource['can_reserve'] = true;
			} else {
				global $wpdb;

				$reservers = Dibs::getTableName('reserver_roles');

				$query = "select role from {$reservers} where resource_id = %d";
				$roles = $wpdb->get_results($wpdb->prepare($query, [$resource['id']]));

				foreach ($roles as $role) {
					if ($user->has_cap($role->role)) {
						$resource['can_reserve'] = true;
					}
				}
			}
		}

		return $resource;
	}
}
