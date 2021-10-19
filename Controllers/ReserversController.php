<?php

namespace Dibs\Controllers;

require_once('BaseController.php');

class ReserversController extends BaseController {
	const TABLE = 'reservers';
	const COLUMNS = [
		'capability',
		'resource_id',
	];
	const REQUIRED = [
		'capability',
		'resource_id',
	];
	// const DELETED_AT_COLUMN = 'archived_at';
}
