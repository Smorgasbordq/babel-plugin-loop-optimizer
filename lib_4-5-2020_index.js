"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var LET = "let";
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

    if (isStmt) {
      var comments = path.node.leadingComments;

      if (comments && comments[comments.length - 1]) {
        comment = comments[comments.length - 1].value;

        if (/^\s*loop-optimizer:(\s+)KEEP/.test(comment)) {
          return null;
        }
      }
    }

    if (par) switch (par.type) {
      case "IfStatement":
        rp = par.get("consequent");

        if (!t.isBlockStatement(rp.node)) {
          rp.replaceWith(t.blockStatement([rp.node]));
        }

        break;

      case "ForStatement":
      case "WhileStatement":
        rp = par.get("body");

        if (!t.isBlockStatement(rp.node)) {
          rp.replaceWith(t.blockStatement([rp.node]));
        }

        break;

      case "ArrowFunctionExpression":
        rp = par.get("body");

        if (!t.isBlockStatement(rp.node)) {
          rp.replaceWith(t.blockStatement([t.returnStatement(rp.node)]));
        }

        break;
    }

    if (isStmt) {
      return !comment ? [false, false] : [/^\s*loop-optimizer:(.*),?AGGRO/.test(comment), /^\s*loop-optimizer:(.*),?POSSIBLE_UNDEFINED/.test(comment)];
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
  var par = path.parentPath,
      oldNodeOfPath = path.node,
      createdNode,
      expr;

  while (par) {
    if (par.isStatement()) {
      // was isBlockStatement || isVariableDeclarator
      break;
    }

    if (par.isConditionalExpression() || par.isLogicalExpression()) {
      createdNode = par.node;
      /**/

      if (createdNode.alternate === oldNodeOfPath) createdNode = t.unaryExpression("!", createdNode.test);else if (createdNode.consequent === oldNodeOfPath) createdNode = createdNode.test;else if (createdNode.right === oldNodeOfPath) createdNode = createdNode.operator === "&&" ? createdNode.left : createdNode.operator === "??" ? t.binaryExpression("==", createdNode.left, t.identifier("null")) : t.unaryExpression("!", createdNode.left);else createdNode = null; //else if(createdNode.test === oldNodeOfPath) createdNode = null;
      //else if(createdNode.left === oldNodeOfPath) createdNode = null;

      if (createdNode) {
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
  var t = returnModder.t,
      path = returnModder.path,
      itemName = returnModder.itemName,
      resArrName = returnModder.resArrName,
      iterator = returnModder.iterator,
      mode = returnModder.mode;

  if (!returnModder.lbl && (isLabelNeeded === 2 || isLabelNeeded === 1 && (mode === 3 || mode === 4))) {
    returnModder.lbl = t.labeledStatement(path.scope.generateUidIdentifier("l"), t.blockStatement([]));
  }

  var bodExpr = body.argument || body.expression || body;
  var exprType = mode <= 1 ? 0 : bodExpr.type === "BooleanLiteral" ? bodExpr.value === false ? 1 : bodExpr.value === true ? 2 : 0 : 0;
  var stmt = mode === 0 ? t.expressionStatement(bodExpr) : mode === 1 ? t.expressionStatement(t.assignmentExpression("=", t.memberExpression(resArrName, iterator, true), bodExpr)) : mode === 2 ? exprType === 1 ? null : exprType === 2 ? t.expressionStatement(t.callExpression(t.memberExpression(resArrName, t.identifier("push")), [itemName])) : t.ifStatement(bodExpr, t.expressionStatement(t.callExpression(t.memberExpression(resArrName, t.identifier("push")), [itemName]))) : mode === 3 ? exprType === 1 ? null : exprType === 2 ? t.expressionStatement(t.assignmentExpression("=", resArrName, itemName)) : t.ifStatement(bodExpr, t.blockStatement([t.expressionStatement(t.assignmentExpression("=", resArrName, itemName)), isLabelNeeded ? t.breakStatement(returnModder.lbl.label) : t.breakStatement()])) : mode === 4 ? exprType === 2 ? null : exprType === 1 ? t.expressionStatement(t.assignmentExpression("=", resArrName, t.booleanLiteral(false))) : t.ifStatement(t.unaryExpression("!", bodExpr), t.blockStatement([t.expressionStatement(t.assignmentExpression("=", resArrName, t.booleanLiteral(false))), isLabelNeeded ? t.breakStatement(returnModder.lbl.label) : t.breakStatement()])) : mode === 5 || mode === 6 ? t.expressionStatement(t.assignmentExpression("=", resArrName, bodExpr)) : mode === 7 ? exprType === 1 ? null : exprType === 2 ? t.expressionStatement(t.assignmentExpression("=", resArrName, t.booleanLiteral(true))) : t.ifStatement(bodExpr, t.blockStatement([t.expressionStatement(t.assignmentExpression("=", resArrName, t.booleanLiteral(true))), isLabelNeeded ? t.breakStatement(returnModder.lbl.label) : t.breakStatement()])) : null;
  var next = mode === 3 && exprType === 2 || mode === 4 && exprType === 1 || mode === 6 && exprType === 2 ? isLabelNeeded ? t.breakStatement(returnModder.lbl.label) : t.breakStatement() : isLabelNeeded === 2 ? t.continueStatement(returnModder.lbl.label) : t.continueStatement();
  return stmt && next ? [stmt, next] : stmt ? [stmt] : [next];
}
/**
 * Modify return statements into array assignments and continues.
 * @param returnModder - ReturnModder instance object: { t, path, itemName, resArrName, iterator, lbl, mode }
 * @param body - The body, with an argument or expression to assign the array to.
 * @param isLabelNeeded - If a label is needed, due to being within a Switch/For/While statement. 1===Needed For Break; 2===Needed For Continue/Break;
 */


function _modReturnsToAssignsAndContinues(returnModder, body, isLabelNeeded) {
  var t = returnModder.t; // Hack to support body not being an array.

  for (var i = 0, I = body.length || 1; i < I; i++) {
    var bod = body[i] || body,
        type = bod.type;

    if (type === "ArrowFunctionExpression" || type === "FunctionExpression" || type === "FunctionDeclaration") {
      continue;
    }

    var isLabelNeededForBod = isLabelNeeded === 2 || type === "ForStatement" || type === "WhileStatement" ? 2 : type === "SwitchStatement" ? 1 : isLabelNeeded;
    var cons = void 0;

    if (type === "ReturnStatement") {
      if (body.length) {
        // If possible, alter the array.
        var res = _craftAssignAndContinueExprs(returnModder, bod, isLabelNeededForBod);

        if (res.length === 1) {
          body[i] = res[0];
        } else {
          body[i] = res[0];
          body.splice(++i, 0, res[1]);
          I++;
        }
      } else {
        // Otherwise, use assign to change the body into a blockStatement. This shouldn't be reached though.
        var _res = _craftAssignAndContinueExprs(returnModder, bod, isLabelNeededForBod);

        Object.assign(body, _res.length === 1 ? _res[0] : t.blockStatement(_res));
      }
    } else if ((cons = bod.consequent) && cons.type === "ReturnStatement") {
      var _res2 = _craftAssignAndContinueExprs(returnModder, cons, isLabelNeededForBod);

      bod.consequent = _res2.length === 1 ? _res2[0] : t.blockStatement(_res2);
    } else if (cons && cons.body) {
      _modReturnsToAssignsAndContinues(returnModder, cons.body, isLabelNeededForBod);
    } else if (cons && cons.length) {
      _modReturnsToAssignsAndContinues(returnModder, cons, isLabelNeededForBod);
    } else if (bod.cases) {
      _modReturnsToAssignsAndContinues(returnModder, bod.cases, isLabelNeededForBod);
    } else if (bod.body) {
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
  var func = path.node.arguments[0],
      useArrExpr = path.node.callee.object.type === "Identifier",
      arrayName = useArrExpr ? path.node.callee.object : path.scope.generateUidIdentifier("a"),
      type = func.type,
      isInFn = type === "ArrowFunctionExpression" || type === "FunctionExpression",
      iterator = isInFn && func.params && func.params[mode === 5 || mode === 6 ? 2 : 1] || path.scope.generateUidIdentifier("i"),
      len = path.scope.generateUidIdentifier("L"),
      itemName = isInFn ? func.params && func.params[mode === 5 || mode === 6 ? 1 : 0] || mode >= 3 && path.scope.generateUidIdentifier("n") || null : path.scope.generateUidIdentifier("n"),
      resArrName = mode > 0 ? (mode === 5 || mode === 6) && func.params && func.params[0] || path.scope.generateUidIdentifier("r") : null,
      body = isInFn ? func.body.type === "CallExpression" && (func.body = t.returnStatement(func.body)) || func.body.body || func.body : null,
      lastOfBod = isInFn ? body.length ? body[body.length - 1] : body : null,
      block = path.findParent(function (p) {
    return p.isBlockStatement() || p.isProgram();
  }),
      startIf = _logicalExpressionToPath(t, path),
      returnModder = {
    t: t,
    path: path,
    itemName: itemName,
    resArrName: resArrName,
    iterator: iterator,
    forState: forState,
    mode: mode
  };

  if (isInFn) {
    var itemDeclr = t.variableDeclaration(LET, [t.variableDeclarator(itemName, t.memberExpression(arrayName, iterator, true))]);

    if (!body.length) {
      var assigns = _craftAssignAndContinueExprs(returnModder, lastOfBod, null);

      var funcLiteralIgnore = func.body.type.lastIndexOf("Literal") >= 0;
      func.body = t.blockStatement(assigns.length === 1 ? funcLiteralIgnore ? [] : [itemDeclr, func.body] : assigns[1].type === "BreakStatement" ? [itemDeclr, assigns[0], assigns[1]] : [itemDeclr, assigns[0]]);
    } else {
      if (itemName) {
        body.unshift(itemDeclr);
      }

      if (mode > 0 && lastOfBod && (lastOfBod.expression || lastOfBod.argument)) {
        var _exprs = _craftAssignAndContinueExprs(returnModder, lastOfBod, null);

        body[body.length - 1] = _exprs[0];
        if (_exprs.length === 2 && _exprs[1].type === "BreakStatement") body.push(_exprs[1]);
      }

      _modReturnsToAssignsAndContinues(returnModder, body, false);

      if (body[body.length - 1].type === "ContinueStatement") {
        body.splice(body.length - 1, 1);
      }
    }
  }

  var funcName = isInFn ? null : path.scope.generateUidIdentifier("f"),
      expr;

  if (isInFn) {
    expr = func.body;
  } else {
    var calling = t.callExpression(funcName, mode === 5 || mode === 6 ? [resArrName, t.memberExpression(arrayName, iterator, true), iterator, arrayName] : [t.memberExpression(arrayName, iterator, true), iterator, arrayName]);

    var _exprs2 = _craftAssignAndContinueExprs(returnModder, calling, null);

    expr = _exprs2.length === 2 && _exprs2[1].type === "BreakStatement" ? t.blockStatement(_exprs2) : _exprs2[0];
  }

  var forState = optimize ? t.forStatement(t.variableDeclaration(LET, [t.variableDeclarator(iterator, len)]), checkUndefined ? t.logicalExpression("&&", t.updateExpression("--", iterator), t.binaryExpression("!==", t.memberExpression(arrayName, iterator, true), t.identifier("undefined"))) : t.updateExpression("--", iterator), null, expr) : t.forStatement(t.variableDeclaration(LET, [t.variableDeclarator(iterator, t.numericLiteral(0))]), checkUndefined ? t.logicalExpression("&&", t.binaryExpression("<", iterator, len), t.binaryExpression("!==", t.memberExpression(arrayName, iterator, true), t.identifier("undefined"))) : t.binaryExpression("<", iterator, len), t.updateExpression("++", iterator), expr); // Change the forState to be the labled for statement.

  if (returnModder && returnModder.lbl) {
    returnModder.lbl.body = forState;
    forState = returnModder.lbl;
  }

  var exprs = [];

  if (!useArrExpr) {
    exprs.push(t.variableDeclaration(LET, [t.variableDeclarator(arrayName, path.node.callee.object)]));
  }

  exprs.push(t.variableDeclaration(LET, [t.variableDeclarator(len, t.memberExpression(arrayName, t.identifier('length')))]));
  var resExpr = mode === 1 ? t.newExpression(t.identifier('Array'), [len]) : mode === 2 ? t.arrayExpression() : mode === 3 ? "\0" : mode === 4 ? t.booleanLiteral(true) : mode === 5 || mode === 6 ? path.node.arguments[1] || "\0" : mode === 7 ? t.booleanLiteral(false) : null;

  if (resExpr) {
    if (startIf) {
      if (resExpr !== "\0") exprs.push(t.expressionStatement(t.assignmentExpression("=", resArrName, resExpr)));
    } else {
      exprs.push(t.variableDeclaration(LET, [resExpr === "\0" ? t.variableDeclarator(resArrName) : t.variableDeclarator(resArrName, resExpr)]));
    }
  }

  if (!isInFn) {
    exprs.push(t.variableDeclaration(LET, [t.variableDeclarator(funcName, path.node.arguments[0])]));
  }

  exprs.push(forState);

  if (startIf) {
    block.node.body.unshift(t.variableDeclaration(LET, [t.variableDeclarator(resArrName)]));
    path.getStatementParent().insertBefore([t.ifStatement(startIf, t.blockStatement(exprs))]);
  } else {
    path.getStatementParent().insertBefore(exprs);
  }

  var parentType = path.parentPath.type;

  if (parentType === "ExpressionStatement") {
    path.remove();
  } else if (resArrName) {
    path.replaceWith(resArrName);
  } else {
    path.replaceWith(t.identifier("undefined"));
  }
}

var _default = function _default(babel) {
  var t = babel.types;
  var methods = {
    forEach: 0,
    map: 1,
    filter: 2,
    find: 3,
    every: 4,
    reduce: 5,
    reduceRight: 6,
    some: 7
  };
  if (babel.loose) LET = "var";
  return {
    visitor: {
      CallExpression: function CallExpression(path) {
        if (path.node.callee.property) {
          // && path.node.arguments.length === 1)
          var method = methods[path.node.callee.property.name];

          if (method !== undefined && !isNaN(method)) {
            var opts = _findOrMakeStatementBlockAndGetOptions(t, path);

            if (opts) {
              // Opts change to support find/reduce/reduceRight properly. Path changes due to arrowExpression.
              if (method === 3 || method === 5) opts[0] = false;else if (method === 6) opts[0] = true;
              Handle_map(t, path.node.arguments ? path : path.get("body.0.argument"), opts[0], opts[1], method);
            }
          }
        }
      }
    }
  };
};

exports["default"] = _default;