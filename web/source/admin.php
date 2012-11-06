<?php

/**
 * Very jumbled session management. 
 * TODO: Refactor. Separation of concerns. 
 */
class Admin
{
	private $_isAdmin;

	public function __construct($cookie)
	{
		$this->_isAdmin = false;
		
		// Process login
		$u = '';
		$h = '';
		if(array_key_exists('username', $_COOKIE)) {
			$u = $_COOKIE['username'];
		}
		if(array_key_exists('passhash', $_COOKIE)) {
			$h = $_COOKIE['passhash'];
		}

		$name = F3::get('ADMIN_NAME');
		$hash = F3::get('ADMIN_HASH');

		if($u == $name && $h == $hash) {
			$this->_isAdmin = true;
		}
	}

	public function isAdmin() {
		return $this->_isAdmin;
	}

	// XXX: Doesn't set cookies or change state!
	public function checkLogin($username, $password)
	{
		$name = F3::get('ADMIN_NAME');
		$hash = F3::get('ADMIN_HASH');
		$passhash = sha1($password);

		if($name == $username && $hash == $passhash) {
			return true;
		}
		else {
			return false;
		}
	}
}


?>
