import React from 'react';

import ubuntu from '!raw-loader!./ubuntu.svg';
import nodejs from '!raw-loader!./nodejs.svg';
import java from '!raw-loader!./java.svg';
import php from '!raw-loader!./php.svg';
import dotnet from '!raw-loader!./dotnet.svg';
import elixir from '!raw-loader!./elixir.svg';
import machinelearning from '!raw-loader!./machinelearning.svg';
import jekyll from '!raw-loader!./jekyll.svg';
import ruby from '!raw-loader!./ruby.svg';
import hexo from '!raw-loader!./hexo.svg';
import go from '!raw-loader!./go.svg';
import c from '!raw-loader!./c.svg';
import share from '!raw-loader!./share.svg';

const svgs = {
	'nodejs': nodejs,
	'jekyll': jekyll,
	'hexo': hexo,
	'php-mysql': php,
	'rvm': ruby,
	'rbenv': ruby,
	'java': java,
	'dotnet': dotnet,
	'machine-learning': machinelearning,
	'go': go,
	'c-cpp': c,
}

const match = (label) => {
	if (label.indexOf('php-python-java') !== -1) {
		return ubuntu;
	}
	for (let key in svgs) {
		if (svgs.hasOwnProperty(key)) {
			if (label.indexOf(key) !== -1) {
				return svgs[key];
			}
		}
	}
	return ubuntu;
}

export default (label = '') => {
	return <i className="env-icon" dangerouslySetInnerHTML={{ __html: match(label.toLowerCase()) }}></i>;
}
