<?php
function mi_get_option( $option, $echo = false, $sanitize_callback = '' ) {
	global $cap;
	$value = $cap->$option;
	if ( $sanitize_callback && is_callable( $sanitize_callback ) ) {
		$value = call_user_func( $sanitize_callback, $value );
	}
	if ( $echo ) {
		echo $value;
	} else {
		return $value;
	}
}

function array_flatten( $array ) {
	if ( !is_array( $array ) ) {
		return;
	}
	$result = array();
	foreach ( $array as $key => $value ) {
		if ( is_array( $value ) ) {
			$result = array_merge( $result, array_flatten( $value ) );
		} else {
			$result[$key] = $value;
		}
	}
	return $result;
}