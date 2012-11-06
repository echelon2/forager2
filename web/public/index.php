<?php

/**
 * An index.php is *always* bare. We keep any and all
 * scripting outside of the public web directory in the
 * rare event that a server instance begins to handle the
 * php filetype wrong and begins to serve them as 
 * plaintext.
 *
 * Never, ever expose business logic to the web. Ever.
 */

require '../source/main.php';
 
?>
