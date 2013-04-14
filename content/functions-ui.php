<?php
/**
 * Label inflection for custom post types
 *
 */
function cpt_inflection( $term, $plural = '' ) {
	$u = ucfirst( $term );
	$p = strlen( $plural ) ? $plural : $u . 's';
	return array( 'name'               => _x( $p, 'post type general name' ),
	              'singular_name'      => _x( $u, 'post type singular name' ),
	              'add_new'            => _x( 'Add New', $u ),
	              'add_new_item'       => __( 'Add New ' . $u ),
	              'edit_item'          => __( 'Edit ' . $u ),
	              'new_item'           => __( 'New ' . $u ),
	              'view_item'          => __( 'View ' . $u ),
	              'search_items'       => __( 'Search ' . $p ),
	              'not_found'          => __( 'No ' . $p . ' found' ),
	              'not_found_in_trash' => __( 'No ' . $p . ' found in Trash' )
	);
}

/**
 * Label inflection for custom taxonomies
 *
 */
function tax_inflection( $str = '', $plural = '' ) {
	$p = strlen( $plural ) ? $plural : $str . 's';
	return array( 'name'              => _x( $p, 'taxonomy general name' ),
	              'singular_name'     => _x( $str, 'taxonomy singular name' ),
	              'search_items'      => __( 'Search ' . $p ),
	              'all_items'         => __( 'All ' . $p ),
	              'parent_item'       => __( 'Parent ' . $str ),
	              'parent_item_colon' => __( 'Parent ' . $str . ':' ),
	              'edit_item'         => __( 'Edit ' . $str ),
	              'update_item'       => __( 'Update ' . $str ),
	              'add_new_item'      => __( 'Add New ' . $str ),
	              'new_item_name'     => __( 'New ' . $str . ' Name' ),
	              'menu_name'         => __( $p ),
	);
}