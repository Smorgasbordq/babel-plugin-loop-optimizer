/**
 * 
 * @param {*} path Path to search
 * @returns Statement Parent or Program
 */
function _findOrMakeStatementBlockAndGetOptions(t, incPath) {
	var path = incPath;
	do {
		var par = path.parentPath,
			rp = null,
			isStmt = path.isStatement() || path.isProgram(),
			comment;

		if(isStmt) {
			var comments = path.node.leadingComments
			if (comments && comments[comments.length - 1]) {
				comment = comments[comments.length - 1].value
				if (/^\s*loop-optimizer:(\s+)KEEP/.test(comment)) {
					return null;
				}
			}
		}

		if(par) switch(par.type) {
		case "IfStatement":
			rp = par.get("consequent");
			if(!t.isBlockStatement(rp.node)) {
				rp.replaceWith(t.blockStatement([ rp.node ]));
			}
			break;
		case "ForStatement":
		case "WhileStatement":
			rp = par.get("body");
			if(!t.isBlockStatement(rp.node)) {
				rp.replaceWith(t.blockStatement([ rp.node ]));
			}
			break;
		case "ArrowFunctionExpression":
			rp = par.get("body");
			if(!t.isBlockStatement(rp.node)) {
				rp.replaceWith(t.blockStatement([ t.returnStatement(rp.node) ]))
			}
			break;
		}

		if(isStmt) {
			return !comment ? [false, false] : [ /^\s*loop-optimizer:(.*),?AGGRO/.test(comment), /^\s*loop-optimizer:(.*),?POSSIBLE_UNDEFINED/.test(comment)];
		}
	} while (path = path.parentPath);

}

/**
 * Determine the logicalExpression needed to get to a path.
 *
 * @param path - The path that may or may not be the result of conditional/logical expressions.
 * @returns Null, or a node or logically &&'d expressions of nodes to get to a path.
 */
function _logicalExpressionToPath(t, path) {
	let par = path.parentPath,
		oldNodeOfPath = path.node,
		createdNode,
		expr;
	while(par) {
		if(par.isStatement()) { // was isBlockStatement || isVariableDeclarator
			break;
		}
		if(par.isConditionalExpression() || par.isLogicalExpression()) {
			createdNode = par.node;			
			/**/ if(createdNode.alternate === oldNodeOfPath) createdNode = t.unaryExpression("!", createdNode.test);
			else if(createdNode.consequent === oldNodeOfPath) createdNode = createdNode.test;
			else if(createdNode.right === oldNodeOfPath) createdNode = 
				createdNode.operator==="&&" ? createdNode.left
				: createdNode.operator==="??" ? t.binaryExpression("==", createdNode.left, t.identifier("null"))
				: t.unaryExpression("!", createdNode.left)
			else createdNode = null;
			//else if(createdNode.test === oldNodeOfPath) createdNode = null;
			//else if(createdNode.left === oldNodeOfPath) createdNode = null;
			
			if(createdNode) {
				expr = expr ? t.logicalExpression("&&", createdNode, expr) : createdNode;
			}
		}
		oldNodeOfPath = par.node;
		par = par.parentPath;
	}
	return expr;
}

/**
 * Make an assignmentExpression (array[i]=value) and continueStatement (continue;) for a particular body.
 * If required, returnModder is modified so that a labeledStatement is created at returnModder.lbl.
 * @param returnModder - ReturnModder instance.
 * @param body - The body, with an argument or expression to assign the array to.
 * @param isLabelNeeded - If a label is needed, due to being within a Switch/For/While statement. 1===Needed For Break; 2===Needed For Continue/Break;
 * @returns [] 0=expression(assignment("=",member)); 1=breakOrContinueStatement(withLabelIfRequired);
 */
function _craftAssignAndContinueExprs(returnModder, body, isLabelNeeded) {
	const { t, path, itemName, resArrName, iterator, mode } = returnModder;
	if(!returnModder.lbl && (isLabelNeeded===2 || (isLabelNeeded===1 && (mode===3 || mode===4)))) {
		returnModder.lbl = t.labeledStatement(path.scope.generateUidIdentifier("l"), t.blockStatement([]));
	}
	let bodExpr = body.argument || body.expression || body;
	let exprType = mode <= 1 ? 0
		: bodExpr.type === "BooleanLiteral" ? (bodExpr.value===false ? 1 : bodExpr.value===true ? 2 : 0)
		: 0;
	let stmt = mode === 1 ? t.expressionStatement(t.assignmentExpression("=",t.memberExpression(resArrName, iterator, true), bodExpr))
		: mode === 2 ?
			exprType === 1 ? null : exprType === 2 ? t.expressionStatement(t.callExpression(t.memberExpression(resArrName, t.identifier("push")), [itemName]))
			: t.ifStatement(bodExpr, t.expressionStatement(t.callExpression(t.memberExpression(resArrName, t.identifier("push")), [itemName])))
		: mode === 3 ?
			exprType === 1 ? null : exprType === 2 ? t.expressionStatement(t.assignmentExpression("=",resArrName,itemName))
			: t.ifStatement(bodExpr, t.blockStatement([t.expressionStatement(t.assignmentExpression("=",resArrName,itemName)), isLabelNeeded ? t.breakStatement(returnModder.lbl.label) : t.breakStatement()]))
		: mode === 4 ?
			exprType === 2 ? null : exprType === 1 ? t.expressionStatement(t.assignmentExpression("=",resArrName,t.booleanLiteral(false)))
			: t.ifStatement(t.unaryExpression("!", bodExpr), t.blockStatement([t.expressionStatement(t.assignmentExpression("=",resArrName,t.booleanLiteral(false))), isLabelNeeded ? t.breakStatement(returnModder.lbl.label) : t.breakStatement() ]))
		: mode === 5 || mode === 6 ?
			t.expressionStatement(t.assignmentExpression("=",resArrName,bodExpr))
		: mode === 7 ?
			exprType === 1 ? null : exprType === 2 ? t.expressionStatement(t.assignmentExpression("=",resArrName,t.booleanLiteral(true)))
			: t.ifStatement(bodExpr, t.blockStatement([t.expressionStatement(t.assignmentExpression("=",resArrName,t.booleanLiteral(true))), isLabelNeeded ? t.breakStatement(returnModder.lbl.label) : t.breakStatement()]))
		: null;
	let next = mode===3&&exprType===2 || mode===4&&exprType===1 || mode===6&&exprType===2 ? isLabelNeeded ? t.breakStatement(returnModder.lbl.label) : t.breakStatement()
		:  isLabelNeeded===2 ? t.continueStatement(returnModder.lbl.label) : t.continueStatement();
	return stmt && next ? [stmt, next] : stmt ? [stmt] : [next];
}

/**
 * Modify return statements into array assignments and continues.
 * @param returnModder - ReturnModder instance object: { t, path, itemName, resArrName, iterator, lbl, mode }
 * @param body - The body, with an argument or expression to assign the array to.
 * @param isLabelNeeded - If a label is needed, due to being within a Switch/For/While statement. 1===Needed For Break; 2===Needed For Continue/Break;
 */
function _modReturnsToAssignsAndContinues(returnModder, body, isLabelNeeded) {
	const { t } = returnModder;
	// Hack to support body not being an array.
	for(let i=0, I=body.length || 1; i<I; i++) {
		let bod = body[i] || body, type = bod.type;
		if(type === "ArrowFunctionExpression" || type === "FunctionExpression" || type === "FunctionDeclaration") {
			continue;
		}
		let isLabelNeededForBod = isLabelNeeded === 2 || type === "ForStatement" || type === "WhileStatement" ? 2
			: type === "SwitchStatement" ? 1
			: isLabelNeeded;

		let cons;
		if(type === "ReturnStatement") {
			if(body.length) { // If possible, alter the array.
				let res = _craftAssignAndContinueExprs(returnModder, bod, isLabelNeededForBod);
				if(res.length === 1) {
					body[i] = res[0];
				} else {
					body[i] = res[0];
					body.splice(++i, 0, res[1]);
					I++;
				}
			} else { // Otherwise, use assign to change the body into a blockStatement. This shouldn't be reached though.
				let res = _craftAssignAndContinueExprs(returnModder, bod, isLabelNeededForBod);
				Object.assign(body, res.length===1 ? res[0] : t.blockStatement( res ));
			}	
		} else if((cons=bod.consequent) && cons.type === "ReturnStatement") {
			let res = _craftAssignAndContinueExprs(returnModder, cons, isLabelNeededForBod);
			bod.consequent = res.length===1 ? res[0] : t.blockStatement( res );
		} else if(cons && cons.body){
			_modReturnsToAssignsAndContinues(returnModder, cons.body, isLabelNeededForBod);
		} else if(cons && cons.length){
			_modReturnsToAssignsAndContinues(returnModder, cons, isLabelNeededForBod);		
		} else if(bod.cases) {
			_modReturnsToAssignsAndContinues(returnModder, bod.cases, isLabelNeededForBod);
		} else if(bod.body) {
			_modReturnsToAssignsAndContinues(returnModder, bod.body, isLabelNeededForBod);
		}
	}
}

/**
 * 
 * @param {*} t babel t
 * @param {*} path  babel path
 * @param {*} optimize "Optimizes" by searching backwards from the end of the array
 * @param {*} checkUndefined if a conditional is required, to check that the item !== undefined
 * @param {*} mode 0=forEach, 1=map, 2=filter, 3=find, 4=every, 5=reduce, 6=reduceRight, 7=some
 */
function Handle_map(t, path, optimize, checkUndefined, mode) {
	let func = path.node.arguments[0],
		useArrExpr = path.node.callee.object.type === "Identifier",
		arrayName = useArrExpr ? path.node.callee.object : path.scope.generateUidIdentifier("a"),
		type = func.type,
		isInFn = type === "ArrowFunctionExpression" || type === "FunctionExpression",
		iterator = isInFn && func.params && func.params[(mode===5||mode===6) ? 2 : 1] || path.scope.generateUidIdentifier("i"),
		len = path.scope.generateUidIdentifier("L"),
		itemName = isInFn ? func.params && func.params[(mode===5||mode===6) ? 1 : 0] || ((mode >= 3) && path.scope.generateUidIdentifier("n")) || null : path.scope.generateUidIdentifier("n"),
		resArrName = mode > 0 ? (mode===5||mode===6) && func.params && func.params[0] || path.scope.generateUidIdentifier("r") : null,
		body = isInFn ? func.body.body || func.body : null,
		lastOfBod = isInFn ? body.length ? body[body.length-1] : body : null,
		block = path.findParent(p => p.isBlockStatement() || p.isProgram()),
		startIf = _logicalExpressionToPath(t, path),
		returnModder = { t, path, itemName, resArrName, iterator, forState, mode };

	if(isInFn) {
		let itemDeclr = t.variableDeclaration("let", [t.variableDeclarator(itemName, t.memberExpression(arrayName,iterator,true))]);
		if(!body.length) {
			let assigns = _craftAssignAndContinueExprs(returnModder, lastOfBod, null);
			let funcLiteralIgnore = func.body.type.lastIndexOf("Literal")>=0;
			func.body = t.blockStatement(assigns.length===1 ? funcLiteralIgnore ? [] : [itemDeclr, func.body] : assigns[1].type==="BreakStatement" ? [itemDeclr, assigns[0], assigns[1]] : [itemDeclr, assigns[0]]);
		} else {
			if(itemName) {
				body.unshift(itemDeclr)
			}
			if(mode > 0 && lastOfBod && (lastOfBod.expression || lastOfBod.argument)) {
				let exprs = _craftAssignAndContinueExprs(returnModder, lastOfBod, null);
				body[body.length-1] = exprs[0];
				if(exprs.length === 2 && exprs[1].type==="BreakStatement") body.push(exprs[1]);
			}
			_modReturnsToAssignsAndContinues(returnModder, body, false);
		}
	}

	var funcName = isInFn ? null : path.scope.generateUidIdentifier("f"),
		expr;
	if(isInFn) {
		expr = func.body;
	} else {
		var calling = t.callExpression(funcName,mode===5||mode===6 ? [resArrName, t.memberExpression(arrayName,iterator,true), iterator, arrayName] : [t.memberExpression(arrayName,iterator,true), iterator, arrayName]);
		let exprs = _craftAssignAndContinueExprs(returnModder, calling, null);
		expr = (exprs.length === 2 && exprs[1].type==="BreakStatement") ? t.blockStatement(exprs) : exprs[0];
	}

	var forState = optimize
		? t.forStatement(
			t.variableDeclaration("let", [t.variableDeclarator (iterator,len)]),
			checkUndefined ? t.logicalExpression("&&", t.updateExpression("--", iterator), t.binaryExpression("!==", t.memberExpression (arrayName,iterator,true), t.identifier("undefined"))) : t.updateExpression("--", iterator),
			null, expr
		)
		: t.forStatement(
			t.variableDeclaration("let", [t.variableDeclarator(iterator, t.numericLiteral(0))]),
			checkUndefined ? t.logicalExpression("&&", t.binaryExpression("<",iterator,len), t.binaryExpression("!==", t.memberExpression(arrayName,iterator,true), t.identifier("undefined"))) : t.binaryExpression("<",iterator,len),
			t.updateExpression("++", iterator), expr
		)

	// Change the forState to be the labled for statement.
	if(returnModder && returnModder.lbl) {
		returnModder.lbl.body = forState;
		forState = returnModder.lbl;
	}

	var exprs = [];	
	if(!useArrExpr) {
		exprs.push(t.variableDeclaration("let", [t.variableDeclarator(arrayName, path.node.callee.object)]));
	}
	exprs.push(t.variableDeclaration("let", [t.variableDeclarator(len, t.memberExpression(arrayName, t.identifier('length')))]));
	var resExpr = mode === 1 ? t.newExpression(t.identifier('Array'), [len])
		: mode === 2 ? t.arrayExpression()
		: mode === 3 ? "\0"
		: mode === 4 ? t.booleanLiteral(true)
		: mode === 5 || mode === 6 ? path.node.arguments[1] || "\0"
		: mode === 7 ? t.booleanLiteral(false)
		: null;
	if(resExpr) {
		if(startIf) {
			if(resExpr !== "\0") exprs.push(t.expressionStatement(t.assignmentExpression("=", resArrName, resExpr)));
		} else {
			exprs.push(t.variableDeclaration("let", [resExpr === "\0" ?  t.variableDeclarator(resArrName) : t.variableDeclarator(resArrName, resExpr)]));
		}
	}
	if(!isInFn) {
		exprs.push(t.variableDeclaration("let", [t.variableDeclarator(funcName,path.node.arguments[0])]));
	}
	exprs.push(forState);

	if(startIf) {
		block.node.body.unshift(t.variableDeclaration("let", [t.variableDeclarator(resArrName)]))
		path.getStatementParent().insertBefore([ t.ifStatement(startIf, t.blockStatement(exprs)) ])
	} else {
		path.getStatementParent().insertBefore(exprs)
	}
	const parentType = path.parentPath.type;
	if(parentType === "ExpressionStatement") {
		path.remove();
	} else if(resArrName) {
		path.replaceWith(resArrName);
	} else {
		path.replaceWith(t.identifier("undefined"));		
	}
}

export default babel => {
	const { types: t } = babel
	const methods = { forEach:0, map:1, filter:2, find:3, every:4, reduce:5, reduceRight:6, some:7 };

	return {
		visitor: {
			CallExpression(path) {
				if(path.node.callee.property) { // && path.node.arguments.length === 1)
					var method = methods[path.node.callee.property.name];
					if(method !== undefined) {
						var opts = _findOrMakeStatementBlockAndGetOptions(t, path);
						if(opts) { // Opts change to support find/reduce/reduceRight properly. Path changes due to arrowExpression.
							if(method===3 || method===5) opts[0]=false;
							else if(method===6) opts[0]=true;
							Handle_map(t, path.node.arguments ? path : path.get("body.0.argument"), opts[0], opts[1], method);
						}
						
					}
				}

			}
		}
	};
}
