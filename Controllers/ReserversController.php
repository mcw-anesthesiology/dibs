<?php

namespace Dibs\Controllers;

require_once('BaseController.php');

class ReserversController extends BaseController {
	const TABLE = 'reservers_roles';
	const COLUMNS = [
		'role',
		'resource_id',
	];
	const REQUIRED = [
		'role',
		'resource_id',
	];
	// const DELETED_AT_COLUMN = 'archived_at';
}
