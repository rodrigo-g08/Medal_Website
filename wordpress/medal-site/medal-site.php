<?php
/**
 * Plugin Name:       Medal Site
 * Description:       Publica el sitio de Medal (portada, Work, Film & Services y Contact) dentro de WordPress, sin pasar por el tema ni por Elementor. Cada página se activa por separado en Ajustes → Medal Site.
 * Version:           1.2.0
 * Requires at least: 5.8
 * Requires PHP:      7.4
 * Author:            Medal
 * Text Domain:       medal-site
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'MEDAL_SITE_VERSION', '1.2.0' );
define( 'MEDAL_SITE_DIR', plugin_dir_path( __FILE__ ) );
define( 'MEDAL_SITE_OPTION', 'medal_site_routes' );
define( 'MEDAL_SITE_VIDEO_OPTION', 'medal_site_cover_video' );
define( 'MEDAL_SITE_LABEL_OPTION', 'medal_site_cover_label' );

// Video de portada que ya está en la biblioteca de medios de WordPress.
define( 'MEDAL_SITE_DEFAULT_VIDEO', 'https://medalusa.com/wp-content/uploads/Meda_Video_Landing.mp4' );
define( 'MEDAL_SITE_DEFAULT_LABEL', 'RIMAC 130 YEARS FILM · WESTIN HOTEL' );

// Ruta con la que se compiló el sitio (wordpress/build-plugin.mjs).
define( 'MEDAL_SITE_BUILD_BASE', '/wp-content/plugins/medal-site/dist/' );

/**
 * Páginas que el plugin sabe servir.
 * clave => [ etiqueta, dirección, archivos compilados por ruta ]
 */
function medal_site_pages() {
	return array(
		'work'          => array(
			'label' => 'Work (vive dentro de la portada)',
			'paths' => array( 'work' => 'work/index.html' ),
			'wp'    => array( array( 'slug' => 'work', 'title' => 'Work', 'parent' => '' ) ),
		),
		'film-services' => array(
			'label' => 'Film & Services',
			'paths' => array( 'film-services' => 'film-services/index.html' ),
			'wp'    => array( array( 'slug' => 'film-services', 'title' => 'Film & Services', 'parent' => '' ) ),
		),
		'contact'       => array(
			'label' => 'Contact (incluye la confirmación)',
			'paths' => array(
				'contact'           => 'contact/index.html',
				'contact/confirmed' => 'contact/confirmed/index.html',
			),
			'wp'    => array(
				array( 'slug' => 'contact', 'title' => 'Contact', 'parent' => '' ),
				array( 'slug' => 'confirmed', 'title' => 'Confirmed', 'parent' => 'contact' ),
			),
		),
		'home'          => array(
			'label' => 'Portada + Work en una sola página',
			'paths' => array( '' => 'index.html' ),
			'wp'    => array(),
		),
	);
}

/** Páginas activas. Por defecto todas menos la portada, que hoy vive en Elementor. */
function medal_site_enabled() {
	$enabled = get_option( MEDAL_SITE_OPTION, null );
	if ( ! is_array( $enabled ) ) {
		$enabled = array( 'work', 'film-services', 'contact' );
	}
	return $enabled;
}

register_activation_hook(
	__FILE__,
	function () {
		if ( null === get_option( MEDAL_SITE_OPTION, null ) ) {
			add_option( MEDAL_SITE_OPTION, array( 'work', 'film-services', 'contact' ) );
		}
		medal_site_ensure_pages();
	}
);

/**
 * Crea en Páginas las entradas que falten para las direcciones publicadas,
 * de modo que aparezcan en el listado, en los menús y en el mapa del sitio.
 * Nunca modifica ni borra una página existente: el contenido lo sirve el plugin.
 */
function medal_site_ensure_pages() {
	$enabled = medal_site_enabled();

	foreach ( medal_site_pages() as $key => $page ) {
		if ( ! in_array( $key, $enabled, true ) ) {
			continue;
		}

		foreach ( $page['wp'] as $entry ) {
			$path = '' === $entry['parent'] ? $entry['slug'] : $entry['parent'] . '/' . $entry['slug'];
			if ( get_page_by_path( $path, OBJECT, 'page' ) ) {
				continue;
			}

			$parent_id = 0;
			if ( '' !== $entry['parent'] ) {
				$parent = get_page_by_path( $entry['parent'], OBJECT, 'page' );
				if ( ! $parent ) {
					continue;
				}
				$parent_id = (int) $parent->ID;
			}

			wp_insert_post(
				array(
					'post_type'    => 'page',
					'post_status'  => 'publish',
					'post_title'   => $entry['title'],
					'post_name'    => $entry['slug'],
					'post_parent'  => $parent_id,
					'post_content' => '<!-- Página servida por el plugin Medal Site. No necesita contenido. -->',
				)
			);
		}
	}
}

add_action( 'update_option_' . MEDAL_SITE_OPTION, 'medal_site_ensure_pages', 20, 0 );
add_action( 'add_option_' . MEDAL_SITE_OPTION, 'medal_site_ensure_pages', 20, 0 );

/**
 * Portada: usa el video de la biblioteca de medios y su rótulo, sin cambiar
 * nada más de la página compilada.
 */
function medal_site_apply_cover_video( $html ) {
	$video = trim( (string) get_option( MEDAL_SITE_VIDEO_OPTION, MEDAL_SITE_DEFAULT_VIDEO ) );
	$label = trim( (string) get_option( MEDAL_SITE_LABEL_OPTION, MEDAL_SITE_DEFAULT_LABEL ) );

	if ( '' !== $video ) {
		$html = preg_replace_callback(
			'#<video\\b[^>]*data-cover-video[^>]*>.*?</video>#s',
			function ( $match ) use ( $video ) {
				$block = preg_replace( '#\\sposter="[^"]*"#', '', $match[0] );
				return preg_replace( '#(<source\\b[^>]*\\ssrc=")[^"]*(")#', '${1}' . esc_url( $video ) . '${2}', $block, 1 );
			},
			$html,
			1
		);
	}

	if ( '' !== $label ) {
		$html = preg_replace(
			'#(<span>)[^<]*?(\\s*·\\s*<span[^>]*data-cover-sound-label)#u',
			'${1}' . esc_html( $label ) . '${2}',
			$html,
			1
		);
	}

	return $html;
}

/** Dirección pública de la carpeta dist/ en esta instalación. */
function medal_site_live_base() {
	$path = wp_parse_url( plugins_url( 'dist/', __FILE__ ), PHP_URL_PATH );
	return trailingslashit( $path ? $path : MEDAL_SITE_BUILD_BASE );
}

/** Ruta pedida, relativa a la dirección del sitio y sin barras. */
function medal_site_request_path() {
	$uri  = isset( $_SERVER['REQUEST_URI'] ) ? wp_unslash( $_SERVER['REQUEST_URI'] ) : '/'; // phpcs:ignore WordPress.Security.ValidatedSanitizedInput
	$path = (string) wp_parse_url( $uri, PHP_URL_PATH );
	$home = (string) wp_parse_url( home_url( '/' ), PHP_URL_PATH );

	if ( '' !== $home && '/' !== $home && 0 === strpos( $path, $home ) ) {
		$path = substr( $path, strlen( $home ) );
	}

	$path = trim( rawurldecode( $path ), '/' );
	if ( 'index.php' === $path ) {
		$path = '';
	}
	return $path;
}

/** Devuelve el archivo compilado para una ruta, o null. */
function medal_site_match( $path ) {
	$is_admin = is_user_logged_in() && current_user_can( 'manage_options' );
	$preview  = isset( $_GET['medal_preview'] ) ? sanitize_key( wp_unslash( $_GET['medal_preview'] ) ) : ''; // phpcs:ignore WordPress.Security.NonceVerification
	$enabled  = medal_site_enabled();

	foreach ( medal_site_pages() as $key => $page ) {
		$active = in_array( $key, $enabled, true );

		// Vista previa para administradores: /?medal_preview=home
		if ( $is_admin && $preview === $key && '' === $path ) {
			return reset( $page['paths'] );
		}

		if ( ! $active ) {
			continue;
		}

		if ( array_key_exists( $path, $page['paths'] ) ) {
			return $page['paths'][ $path ];
		}
	}

	return null;
}

/**
 * Sirve la página compilada antes de que WordPress cargue el tema.
 * Prioridad 0: se adelanta a las redirecciones canónicas y a Elementor.
 */
add_action(
	'template_redirect',
	function () {
		if ( is_admin() || wp_doing_ajax() || is_feed() || is_robots() || is_trackback() ) {
			return;
		}
		if ( defined( 'REST_REQUEST' ) && REST_REQUEST ) {
			return;
		}

		$method = isset( $_SERVER['REQUEST_METHOD'] ) ? strtoupper( sanitize_key( $_SERVER['REQUEST_METHOD'] ) ) : 'GET';
		if ( 'GET' !== $method && 'HEAD' !== $method ) {
			return;
		}

		// El editor y las vistas previas de WordPress y Elementor siguen funcionando.
		foreach ( array( 'elementor-preview', 'preview', 'p', 'page_id', 's', 'customize_changeset_uuid' ) as $param ) {
			if ( isset( $_GET[ $param ] ) ) { // phpcs:ignore WordPress.Security.NonceVerification
				return;
			}
		}

		$path = medal_site_request_path();
		$file = medal_site_match( $path );
		if ( null === $file ) {
			return;
		}

		/*
		 * Work y la portada son ahora una sola página. Si la portada del plugin
		 * está publicada, /work/ entra a ella por /#work. Si la portada sigue en
		 * Elementor, /work/ muestra esa misma página ya ubicada en Work.
		 */
		$work_standalone = false;
		if ( 'work/index.html' === $file && ! in_array( 'home', medal_site_enabled(), true ) ) {
			$file            = 'index.html';
			$work_standalone = true;
		}

		$full = MEDAL_SITE_DIR . 'dist/' . $file;
		if ( ! is_readable( $full ) ) {
			return;
		}

		$html = file_get_contents( $full ); // phpcs:ignore WordPress.WP.AlternativeFunctions
		if ( false === $html ) {
			return;
		}

		// Si la carpeta de plugins no está en la ubicación habitual, se ajusta el HTML.
		$live = medal_site_live_base();
		if ( MEDAL_SITE_BUILD_BASE !== $live ) {
			$html = str_replace( MEDAL_SITE_BUILD_BASE, $live, $html );
		}

		if ( 'index.html' === $file ) {
			$html = medal_site_apply_cover_video( $html );
		}

		if ( $work_standalone ) {
			$enter = '<script>if(!location.hash){history.replaceState(null,"",location.pathname+location.search+"#work");}</script>';
			$html  = preg_replace( '#<head([^>]*)>#i', '<head$1>' . $enter, $html, 1 );
		}

		status_header( 200 );
		nocache_headers();
		header( 'Content-Type: text/html; charset=utf-8' );
		header( 'X-Medal-Site: ' . MEDAL_SITE_VERSION );

		if ( 'HEAD' !== $method ) {
			echo $html; // phpcs:ignore WordPress.Security.EscapeOutput
		}
		exit;
	},
	0
);

/* -------------------------------------------------------------------------
 * Ajustes → Medal Site
 * ---------------------------------------------------------------------- */

add_action(
	'admin_menu',
	function () {
		add_options_page( 'Medal Site', 'Medal Site', 'manage_options', 'medal-site', 'medal_site_settings_page' );
	}
);

add_action(
	'admin_init',
	function () {
		register_setting(
			'medal_site',
			MEDAL_SITE_OPTION,
			array(
				'type'              => 'array',
				'default'           => array( 'work', 'film-services', 'contact' ),
				'sanitize_callback' => function ( $value ) {
					$valid = array_keys( medal_site_pages() );
					$value = is_array( $value ) ? array_map( 'sanitize_key', $value ) : array();
					return array_values( array_intersect( $valid, $value ) );
				},
			)
		);
	}
);

add_action(
	'admin_init',
	function () {
		register_setting(
			'medal_site',
			MEDAL_SITE_VIDEO_OPTION,
			array(
				'type'              => 'string',
				'default'           => MEDAL_SITE_DEFAULT_VIDEO,
				'sanitize_callback' => 'esc_url_raw',
			)
		);
		register_setting(
			'medal_site',
			MEDAL_SITE_LABEL_OPTION,
			array(
				'type'              => 'string',
				'default'           => MEDAL_SITE_DEFAULT_LABEL,
				'sanitize_callback' => 'sanitize_text_field',
			)
		);
	}
);

add_filter(
	'plugin_action_links_' . plugin_basename( __FILE__ ),
	function ( $links ) {
		array_unshift( $links, '<a href="' . esc_url( admin_url( 'options-general.php?page=medal-site' ) ) . '">Ajustes</a>' );
		return $links;
	}
);

function medal_site_settings_page() {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}

	$enabled   = medal_site_enabled();
	$has_build = is_readable( MEDAL_SITE_DIR . 'dist/index.html' );
	$live      = medal_site_live_base();
	?>
	<div class="wrap">
		<h1>Medal Site</h1>
		<p>Cada casilla publica una página del sitio nuevo en su dirección. Al desmarcarla, esa dirección vuelve a mostrar lo que WordPress tenía antes.</p>

		<?php if ( ! $has_build ) : ?>
			<div class="notice notice-error"><p>No se encontró la carpeta <code>dist/</code> dentro del plugin. Vuelve a generar el ZIP con <code>node wordpress/build-plugin.mjs</code>.</p></div>
		<?php endif; ?>

		<?php if ( MEDAL_SITE_BUILD_BASE !== $live ) : ?>
			<div class="notice notice-warning"><p>La carpeta de plugins de este sitio es <code><?php echo esc_html( $live ); ?></code> y el sitio se compiló para <code><?php echo esc_html( MEDAL_SITE_BUILD_BASE ); ?></code>. Las páginas pueden cargar sin estilos. Cambia <code>BASE</code> en <code>wordpress/build-plugin.mjs</code> y la constante del plugin, y vuelve a generarlo.</p></div>
		<?php endif; ?>

		<form method="post" action="options.php">
			<?php settings_fields( 'medal_site' ); ?>
			<input type="hidden" name="<?php echo esc_attr( MEDAL_SITE_OPTION ); ?>[]" value="" />
			<table class="widefat striped" style="max-width:760px">
				<thead>
					<tr><th style="width:90px">Publicada</th><th>Página</th><th>Dirección</th><th>En Páginas</th><th>Vista previa</th></tr>
				</thead>
				<tbody>
				<?php foreach ( medal_site_pages() as $key => $page ) : ?>
					<?php
					$first   = array_key_first( $page['paths'] );
					$url     = home_url( '/' . ( '' === $first ? '' : $first . '/' ) );
					$preview = add_query_arg( 'medal_preview', $key, home_url( '/' ) );
					?>
					<tr>
						<td><input type="checkbox" name="<?php echo esc_attr( MEDAL_SITE_OPTION ); ?>[]" value="<?php echo esc_attr( $key ); ?>" <?php checked( in_array( $key, $enabled, true ) ); ?> /></td>
						<td><strong><?php echo esc_html( $page['label'] ); ?></strong></td>
						<td><a href="<?php echo esc_url( $url ); ?>" target="_blank" rel="noopener"><?php echo esc_html( wp_parse_url( $url, PHP_URL_PATH ) ); ?></a></td>
						<td>
							<?php
							if ( empty( $page['wp'] ) ) {
								echo 'Página de inicio actual';
							} else {
								$found = get_page_by_path( $page['wp'][0]['slug'], OBJECT, 'page' );
								echo $found ? '<a href="' . esc_url( get_edit_post_link( $found->ID ) ) . '">Existe</a>' : 'Se crea al publicar';
							}
							?>
						</td>
						<td><a href="<?php echo esc_url( $preview ); ?>" target="_blank" rel="noopener">Ver sin publicar</a></td>
					</tr>
				<?php endforeach; ?>
				</tbody>
			</table>
			<p class="description" style="max-width:760px">«Ver sin publicar» solo funciona con tu sesión de administrador; los visitantes no ven nada distinto. Work y la portada son ahora una sola página: al marcar «Portada + Work», la dirección / muestra el video y, al bajar, Work; y /work/ entra directo a Work. Mientras esté desmarcada, tu inicio sigue siendo el de Elementor y /work/ muestra la página nueva ya ubicada en Work.</p>

			<h2 style="margin-top:28px">Video de la portada</h2>
			<p class="description" style="max-width:760px">Se usa cuando el plugin sirve la Portada (publicada o en vista previa). Pega la dirección del archivo desde Medios.</p>
			<table class="form-table" role="presentation" style="max-width:760px">
				<tr>
					<th scope="row"><label for="medal-site-video">Dirección del video</label></th>
					<td><input id="medal-site-video" type="url" class="regular-text code" style="width:100%" name="<?php echo esc_attr( MEDAL_SITE_VIDEO_OPTION ); ?>" value="<?php echo esc_attr( get_option( MEDAL_SITE_VIDEO_OPTION, MEDAL_SITE_DEFAULT_VIDEO ) ); ?>" /></td>
				</tr>
				<tr>
					<th scope="row"><label for="medal-site-label">Rótulo del botón de sonido</label></th>
					<td><input id="medal-site-label" type="text" class="regular-text" style="width:100%" name="<?php echo esc_attr( MEDAL_SITE_LABEL_OPTION ); ?>" value="<?php echo esc_attr( get_option( MEDAL_SITE_LABEL_OPTION, MEDAL_SITE_DEFAULT_LABEL ) ); ?>" /></td>
				</tr>
			</table>
			<?php submit_button( 'Guardar cambios' ); ?>
		</form>
	</div>
	<?php
}
