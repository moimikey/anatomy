<?php
/**
 * Load database info and local development parameters
 */
if ( file_exists( dirname( __FILE__ ) . '/local-config.php' ) ) {
	define( 'WP_LOCAL_DEV', true );
	include( dirname( __FILE__ ) . '/local-config.php' );
} else {
	define( 'WP_LOCAL_DEV', false );
	define( 'DB_NAME',      '%%DB_NAME%%' );
	define( 'DB_USER',      '%%DB_USER%%' );
	define( 'DB_PASSWORD',  '%%DB_PASSWORD%%' );
	define( 'DB_HOST',      '%%DB_HOST%%' );
}

/**
 * Custom Content Directory
 */
define( 'WP_CONTENT_DIR', dirname( __FILE__ ) . '/content' );
define( 'WP_CONTENT_URL', 'http://' . $_SERVER['SERVER_NAME'] . '/content' );

/**
 * Database specific definitions
 */
define( 'DB_CHARSET', 'utf8' );
define( 'DB_COLLATE', '' );

/**
 * Hash salts
 * Grab these from: https://api.wordpress.org/secret-key/1.1/salt
 */
define( 'AUTH_KEY',         '-V[~W:xF-z}MC}4*&FY)Ze=-o4s<Hmu*Vj,ptHKhK?.W-Ll8nz:-y{a&8D1a}n,&' );
define( 'SECURE_AUTH_KEY',  'h8O$rh^i77seX,$*Sh.R5Csk|`|(U;x3Z>(}QU,oYF{v@_v0?$Xh,*OsJ}MyxGt(' );
define( 'LOGGED_IN_KEY',    'X:b &+{%u.M~O:TS+jvw|!@m*:?N/LJ*!hILBgCo8/3QV6K*vIkpTIg]w)Q}Qn=2' );
define( 'NONCE_KEY',        '-y &^#)~pY-lL<}jY0*Gt$:`FQUgBIf[GKr*1)^.!!P`TXR2h>q%4!0&LQz9bD:}' );
define( 'AUTH_SALT',        'iRn=PFxNEfX+:Bcp@ctKp[ 6 (0|t@ItS<eYZ9:*heCV(|c%i8oF{uov5*s:$-tf' );
define( 'SECURE_AUTH_SALT', 'r4Ms{s=w2%Fsw*=-khUfIv7Jo@kY{h70CR..-tZ)AL? =.DaW>-QDgk(5+=UHOFF' );
define( 'LOGGED_IN_SALT',   '%+#z_a6r+ms43ScJLuyOH8L)2!sDjs~I/3pn]|B7}Q,D|M 7l%Du=of`SL]4pzO:' );
define( 'NONCE_SALT',       '.(wn-96+D3ZX-#AwuaNc9{k0:_36lePRSg3%mZ>HY]B$`E.0Q>+0TEQAp>Q8si,&' );

/**
 * Database prefix
 */
$table_prefix  = 'wp_';

/**
 * Language
 * Leave blank for American English
 */
define( 'WPLANG', '' );

/**
 * Hide PHP errors
 */
ini_set( 'display_errors', 0 );
define( 'WP_DEBUG_DISPLAY', false );

/**
 * Debug
 */
// define( 'SAVEQUERIES', true );
// define( 'WP_DEBUG', true );

/**
 * Multisite
 */
define( 'SUNRISE',              'on' );
define( 'WP_ALLOW_MULTISITE',   true );
define( 'MULTISITE',            true );
define( 'SUBDOMAIN_INSTALL',    false );
define( 'DOMAIN_CURRENT_SITE',  $_SERVER['SERVER_NAME'] );
define( 'PATH_CURRENT_SITE',    '/' );
define( 'SITE_ID_CURRENT_SITE', 1 );
define( 'BLOG_ID_CURRENT_SITE', 1 );

/**
 * Memcached
 */
if ( file_exists( dirname( __FILE__ ) . '/memcached.php' ) )
	$memcached_servers = include( dirname( __FILE__ ) . '/memcached.php' );

/**
 * PHP helpers
 */
define( 'PHP_LIB', WP_CONTENT_DIR . '/php/' );
require_once( PHP_LIB . 'phplib/vendor/autoload.php' );

/**
 * Superglobal
 */
global $_superglobal;
$_superglobal = new stdClass();

function &superman() {
	return $GLOBALS['_superglobal'];
}

/**
 * Bootstrap WordPress
 */
if ( !defined( 'ABSPATH' ) )
	define( 'ABSPATH', dirname( __FILE__ ) . '/wp/' );
require_once( ABSPATH . 'wp-settings.php' );
