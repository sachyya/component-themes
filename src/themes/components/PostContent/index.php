<?php
class ComponentThemes_PostContent extends ComponentThemes_Component {
	public function render() {
		$convertNewlines = function( $content ) {
			return preg_replace( '/\n/', '<br/>', $content );
		};
		$content = $this->getPropFromParent( 'content', 'No content' );
		return "<div class='PostContent'>" . $convertNewlines( $content ) . "</div>";
	}
}

