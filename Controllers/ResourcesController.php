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

			$resource['can_reserve'] = Dibs::canReserve($user, $resource['id']);
		}

		return $resource;
	}
}
