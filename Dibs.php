<?php
/*
Plugin Name: Dibs Resource Reservations
Author: Jacob Mischka
Version: 0.1.0
License: GPL-3.0
*/

namespace Dibs;

defined ('ABSPATH') or die('No');

require_once('Controllers/ReservationsController.php');
require_once('Controllers/ReserversController.php');
require_once('Controllers/ResourcesController.php');

use WP_Error;

class Dibs {
	const API_NAMESPACE = 'dibs/v1';
	const DB_NAMESPACE = 'dibs';

	const ADMIN_CAP = 'dibs_admin';

	const SCRIPT_PATH = 'dist/dibs.umd.js';
	const STYLE_PATH =  'dist/style.css';

	const ALLOWED_ORIGINS = ['http://localhost:3000']; // FIXME

	static function matchesNamespace($route) {
		return strpos($route, self::API_NAMESPACE) === 1;
	}


	public function __construct() {
		register_activation_hook(__FILE__, [$this, 'activatePlugin']);
		add_action('init', [$this, 'initPlugin']);
		add_action('rest_api_init', [$this, 'initRestApi']);
	}

	public function activatePlugin() {
		wp_roles()->add_cap('administrator', self::ADMIN_CAP);

		$this->createTables();
	}

	public function initPlugin() {
		add_shortcode('dibs-app', [$this, 'app_shortcode']);
	}

	public static function getTableName($name) {
		global $wpdb;

		return $wpdb->prefix . self::DB_NAMESPACE . '_' . $name;
	}

	public function initRestApi() {
		remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');

		add_filter('rest_pre_dispatch', function($result, $server, $request) {
			if (self::matchesNamespace($request->get_route()) && $request->get_method() != 'OPTIONS') {
				$user = wp_get_current_user();
				if (!$user || !$user->ID)
					return new WP_Error('unauthorized', 'Unauthorized', ['status' => 401]);
			}

			return $result;
		}, 10, 4);

		add_filter('rest_pre_serve_request', function($served, $response, $request, $server) {
			if (self::matchesNamespace($request->get_route())) {
				header('Access-Control-Allow-Credentials: true');
				header('Access-Control-Allow-Methods: POST, GET, PATCH, DELETE');
				header('Access-Control-Allow-Headers: Authorization, Content-Type, X-WP-Nonce');

				$origin = get_http_origin();
				$allowOrigin = esc_url_raw(site_url());

				if ($origin && in_array($origin, self::ALLOWED_ORIGINS)) {
					$allowOrigin = $origin;
				}
				header('Access-Control-Allow-Origin: ' . $allowOrigin);
			}

		}, 10, 4);

		register_rest_route(self::API_NAMESPACE, '/me', [
			'methods' => ['GET'],
			'callback' => function($request) {
				$user = wp_get_current_user();
				return self::transformUser($user);
			}
		]);

		register_rest_route(self::API_NAMESPACE, '/users', [
			'methods' => ['GET'],
			'callback' => function($request) {
				$users = get_users(['fields' => 'all_with_meta']);

				return array_values(array_map('Dibs\Dibs::transformUser', $users));
			}
		]);

		self::registerController('/reservations', Controllers\ReservationsController::class);
		register_rest_route(self::API_NAMESPACE, '/reservations/recurring', [
			'methods' => ['POST'],
			'callback' => [Controllers\ReservationsController::class, 'handleRecurring']
		]);
		self::registerController('/reservers', Controllers\ReserversController::class);
		self::registerController('/resources', Controllers\ResourcesController::class);
	}

	static function transformUser($user) {
		return [
			'id' => $user->ID,
			'name' => $user->display_name,
			'admin' => $user->has_cap(self::ADMIN_CAP)
		];
	}

	static function registerController($path, $controller) {
		register_rest_route(self::API_NAMESPACE, $path, [
			'methods' => ['GET', 'POST'],
			'callback' => [$controller, 'handleRequest']
		]);
		register_rest_route(self::API_NAMESPACE, $path . '/(?P<id>[\d]+)', [
			'methods' => ['GET', 'PATCH', 'DELETE'],
			'callback' => [$controller, 'handleSingleRequest']
		]);
	}

	static function filterKeys($arr, $keys) {
		return array_filter($arr, function($key) use ($keys) {
			return in_array($key, $keys);
		}, ARRAY_FILTER_USE_KEY);
	}

	static function canReserve($user, $resourceId) {
		if ($user->has_cap(Dibs::ADMIN_CAP)) return true;

		global $wpdb;

		$reservers = Dibs::getTableName('reservers');

		$query = "select capability from {$reservers} where resource_id = %d";
		$reservers = $wpdb->get_results($wpdb->prepare($query, $resourceId));
		foreach ($reservers as $reserver) {
			if ($user->has_cap($reserver->capability)) return true;
		}

		return false;
	}

	public function createTables() {
		global $wpdb;

		$users = $wpdb->prefix . 'users';
		$resources = self::getTableName('resources');
		$reservers = self::getTableName('reservers');
		$reservations = self::getTableName('reservations');


		$charsetCollate = $wpdb->get_charset_collate();
		require_once(ABSPATH . 'wp-admin/includes/upgrade.php');

		$sql = "CREATE TABLE IF NOT EXISTS {$resources} (
			id bigint unsigned not null auto_increment primary key,
			name varchar(255) not null,
			description text,
			image text,
			color varchar(255),
			updated_at datetime default current_timestamp on update current_timestamp,
			archived_at datetime
		) {$charsetCollate}";

		dbDelta($sql);

		$sql = "CREATE TABLE IF NOT EXISTS {$reservers} (
			id bigint unsigned not null auto_increment primary key,
			resource_id bigint unsigned not null,
			capability varchar(255) not null,
			foreign key (resource_id) references {$resources} (id)
		) {$charsetCollate}";

		dbDelta($sql);

		$sql = "CREATE TABLE IF NOT EXISTS {$reservations} (
			id bigint not null auto_increment primary key,
			user_id bigint unsigned not null,
			resource_id bigint unsigned not null,
			reservation_start datetime not null,
			reservation_end datetime not null,
			description text,
			created_at datetime default current_timestamp,
			updated_at datetime default current_timestamp on update current_timestamp,
			deleted_at datetime,
			foreign key (user_id) references {$users} (ID),
			foreign key (resource_id) references {$resources} (id)
		) {$charsetCollate}";

		dbDelta($sql);
	}

	function app_shortcode($atts) {
		wp_enqueue_script(
			"dibs",
			plugin_dir_url(__FILE__) . self::SCRIPT_PATH,
		   	null,
			hash_file('md5', __DIR__ . '/' . self::SCRIPT_PATH)
		);
		wp_enqueue_style(
			"dibs",
			plugin_dir_url(__FILE__) . self::STYLE_PATH,
			null,
			hash_file('md5', __DIR__ . '/' . self::STYLE_PATH)
		);

		return '<div id="dibs-app"></div>';
	}
}

$dibsApp = new Dibs();
