/**
 * External dependencies
 */
import React from 'react';
import classNames from 'classnames';
import shortid from 'shortid';

/**
 * Internal dependencies
 */
import { getComponentByType } from '~/src/lib/components';

function buildComponent( Component, props = {}, children = [] ) {
	return <Component key={ props.key } { ...props }>{ children }</Component>;
}

function buildComponentTreeFromConfig( componentConfig, childProps = {} ) {
	const { id, componentType, children, props } = componentConfig;
	const componentId = id || shortid.generate();
	const Component = getComponentByType( componentType );
	const childComponents = children ? children.map( child => buildComponentTreeFromConfig( child, childProps ) ) : null;
	const componentProps = Object.assign(
		{},
		props || {},
		{ childProps },
		{ className: classNames( componentType, componentId ), key: componentId }
	);
	return { Component, componentId, componentProps, childComponents, componentType };
}

export function getPropsFromParent( mapPropsToProps ) {
	return function( Child ) {
		const ParentProps = ( props ) => {
			const newProps = mapPropsToProps( props.childProps );
			return <Child { ...newProps } { ...props } />;
		};
		return Object.assign( ParentProps, Child );
	};
}

function getContentById( content, componentId, componentType ) {
	return Object.assign( {}, content[ componentId ] || {}, content[ componentType ] || {} );
}

function buildComponentFromTree( tree, content = {} ) {
	const { Component, componentProps, childComponents, componentId, componentType } = tree;
	const children = childComponents ? childComponents.map( child => buildComponentFromTree( child, content ) ) : null;
	const props = Object.assign( {}, componentProps, getContentById( content, componentId, componentType ) );
	return buildComponent( Component, props, children );
}

export function makeComponentWith( componentConfig, childProps = {} ) {
	return buildComponentFromTree( buildComponentTreeFromConfig( componentConfig, childProps ) );
}

function buildComponentFromConfig( componentConfig, content = {} ) {
	return buildComponentFromTree( buildComponentTreeFromConfig( componentConfig ), content );
}

function expandConfigPartials( componentConfig, partials ) {
	if ( componentConfig.partial ) {
		if ( partials[ componentConfig.partial ] ) {
			return partials[ componentConfig.partial ];
		}
		return { componentType: 'ErrorComponent', props: { message: `No partial found matching '${ componentConfig.partial }'` } };
	}
	if ( componentConfig.children ) {
		const children = componentConfig.children.map( child => expandConfigPartials( child, partials ) );
		return Object.assign( {}, componentConfig, { children } );
	}
	return componentConfig;
}

function expandConfigTemplates( componentConfig, templates ) {
	if ( componentConfig.template ) {
		if ( templates[ componentConfig.template ] ) {
			return templates[ componentConfig.template ];
		}
		return { componentType: 'ErrorComponent', props: { message: `No template found matching '${ componentConfig.template }'` } };
	}
	return componentConfig;
}

export function buildComponentsFromTheme( themeConfig, content ) {
	if ( ! themeConfig.pages || ! themeConfig.pages.home ) {
		return <p>themeConfig must contain a `pages.home` component!</p>;
	}
	return buildComponentFromConfig( expandConfigPartials( expandConfigTemplates( themeConfig.pages.home, themeConfig.templates || {} ), themeConfig.partials || {} ), content );
}