<?php

namespace Dibs\Controllers;

require_once('BaseController.php');

class ResourcesController extends BaseController {
	const TABLE = 'resources';
	const COLUMNS = [
		'name',
		'desc',
	];
	const REQUIRED = [
		'name'
	];
	// const DELETED_AT_COLUMN = 'archived_at';
}
