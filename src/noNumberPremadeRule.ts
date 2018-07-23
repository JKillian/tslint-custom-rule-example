import * as ts from "typescript";
import { Rules, IRuleMetadata, RuleFailure, WalkContext } from "tslint";

export class Rule extends Rules.TypedRule {
    public static metadata: IRuleMetadata = {
        ruleName: "no-number-premade",
        type: "typescript",
        description: "disallows uses of numbers in your code",
        optionsDescription: "No options yet",
        options: null,
        requiresTypeInfo: true,
        typescriptOnly: true,
    };

    public applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk, null, program.getTypeChecker());
    }
}

function walk(ctx: WalkContext<null>, checker: ts.TypeChecker) {
    ts.forEachChild(ctx.sourceFile, processNode);

    function processNode(node: ts.Node) {
        if (node.kind === ts.SyntaxKind.NumericLiteral) {
            ctx.addFailureAtNode(node, "You hooligan!");
            return;
        }

        if (node.kind === ts.SyntaxKind.Identifier) {
            const type = checker.getTypeAtLocation(node);
            if (type.isNumberLiteral() || type.getFlags() & ts.TypeFlags.Number) {
                ctx.addFailureAtNode(node, "A secret number! Burn it!");
            }
        }
        ts.forEachChild(node, processNode);
    }
};
