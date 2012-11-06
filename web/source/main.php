<?php

/**
 * This is the "main" file. 
 * Here we set up the libraries, directory paths, etc. 
 */

date_default_timezone_set('UTC'); // TODO -- EST/EDT
ini_set('memory_limit', '1024M');
ini_set('max_execution_time', 0);

// Include libraries
require 'lib/f3/base.php';
require 'lib/smarty/libs/Smarty.class.php';

// Include our code
require 'admin.php';
require 'controllers.php';

// XXX: Environment switch
$IS_DEV_SERVER = true;

// Admin credentials
$ADMIN_NAME = 'admin';
$ADMIN_HASH = 'd033e22ae348aeb5660fc2140aec35850c4da997';
F3::set('ADMIN_NAME', $ADMIN_NAME);
F3::set('ADMIN_HASH', $ADMIN_HASH);

$ADMIN = new Admin($_COOKIE); // TODO: Rename 'session'
F3::set('ADMIN', $ADMIN);

// Path configuration
// (Messy, but gets the job done.)
$DIR_ROOT = realpath(dirname(__FILE__) . '/../');

// ERROR REPORTING
// Make sure to check the `php.ini` in your environment
error_reporting(0);
ini_set('display_errors', '0'); // Won't affect parse
F3::set('DEBUG', 0);

if($IS_DEV_SERVER) {
	error_reporting(E_ALL|E_STRICT|E_PARSE); 
	ini_set('display_errors', '1');
	F3::set('DEBUG', 3);
}

// Sanitized inputs
F3::set('GET', F3::scrub($_GET));
F3::set('POST', F3::scrub($_POST));


// Set up Smarty template engine 
$s = new Smarty();
$s->assign('admin', $ADMIN);

# FIXME: Make these abspaths 
$s->template_dir = '../templates';
$s->compile_dir = '../cache/smarty_compile';
$s->compile_dir = '../cache/smarty_compile';

F3::set('SMARTY', $s);

// Run and serve
F3::run();

?>
