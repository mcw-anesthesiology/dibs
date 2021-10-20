<?php

namespace Dibs\Controllers;

require_once('BaseController.php');

use WP_Error;

class ReserversController extends BaseController {
	const TABLE = 'reservers';
	const COLUMNS = [
		'resource_id',
		'capability',
	];
	const REQUIRED = [
		'resource_id',
		'capability',
	];


	public static function post($request) {
		$response = parent::post($request);

		if (!($response instanceof WP_Error)) {
			$cap = $request->get_param('capability');
			wp_roles()->add_cap('administrator', $cap);
		}

		return $response;
	}
}
