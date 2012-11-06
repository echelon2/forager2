<?php

/**
 * This file contains the CONTROLLERS for the Forager project
 * Controllers are the part of MVC that handle the business
 * logic of the application. 
 */

/* ======================================================== /*
 * INDEX
/* ======================================================== */

/**
 * Index controller
 * Function depends on the session state.
 */
F3::route('GET /', function () {
	F3::get('SMARTY')->display('index.html');
});

/* ======================================================== /*
 * USER PROCESS
 * SIGN IN, SIGN OUT
/* ======================================================== */

F3::route('POST /login', function () {
	$post = F3::get('POST');
	$admin = F3::get('ADMIN');
	
	if($admin->isAdmin()) {
		return F3::reroute('/');
	}

	if(!array_key_exists('username', $post) || 
		!array_key_exists('password', $post)) {
			return F3::reroute('/');
	}

	if(!$admin->checkLogin($post['username'], $post['password'])) {
		return F3::reroute('/');
	}

	setcookie('username', $post['username']);
	setcookie('passhash', sha1($post['password']));

	return F3::reroute('/');
});

F3::route('GET|POST /logout', function () {
	setcookie('username', '', time() - 5000);
	setcookie('passhash', '', time() - 5000);

	return F3::reroute('/');
});

/**
 * Gallery view.
 */
F3::route('GET /report', function () {
	$s = F3::get('SMARTY');
	$s->display('report.html');
});

/* ======================================================== /*
 * STATIC PAGES
 * THESE JUST DISPLAY SIMPLE INFORMATION
/* ======================================================== */

F3::route('GET /legal', function () {
	F3::get('SMARTY')->display('legal.html');
});

