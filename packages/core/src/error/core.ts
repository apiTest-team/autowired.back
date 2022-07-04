import { BaseError, registerErrorCode } from "./base";
import { ObjectIdentifier } from "../decorator";

/**
 * 定义框架错误
 */
export const FrameworkErrorEnum = registerErrorCode("core", {
  UNKNOWN: 99999,
  COMMON: 10000,
  MISSING_RESOLVER: 10001,
  INCONSISTENT_VERSION: 10002,
  MISSING_IMPORTS: 10003,
  DEFINITION_NOT_FOUND: 10004,
  SINGLETON_INJECT_REQUEST: 1005,
  DUPLICATE_CLASS_NAME: 10006,
  INVALID_CONFIG: 10007,
  USE_WRONG_METHOD: 10008,
});

export class CoreInvalidConfigError extends BaseError {
  constructor(message?: string) {
    super( "Invalid config file \n" + message.toString(), FrameworkErrorEnum.INVALID_CONFIG);
  }
}

export class CoreUseWrongMethodError extends BaseError {
  constructor(wrongMethod: string, replacedMethod: string, describeKey?: string) {
    const text = describeKey
      ? `${describeKey} not valid by ${wrongMethod}, Use ${replacedMethod} instead!`
      : `You should not invoked by ${wrongMethod}, Use ${replacedMethod} instead!`;
    super(text, FrameworkErrorEnum.USE_WRONG_METHOD);
  }
}
/**
 * 框架公共的错误返回
 */
export class CoreCommonError extends BaseError {
  constructor(message: string) {
    super(message, FrameworkErrorEnum.COMMON);
  }
}

/**
 * 解析错误
 */
export class CoreResolverMissingError extends BaseError {
  constructor(type: string) {
    super(`${type} resolver is not exists!`, FrameworkErrorEnum.MISSING_RESOLVER);
  }
}

/**
 * 导入组件错误
 */
export class CoreMissingImportComponentError extends BaseError {
  constructor(originName: string) {
    const text = `"${originName}" can't inject and maybe forgot add "{imports: [***]}" in @Configuration.`;
    super(text, FrameworkErrorEnum.MISSING_IMPORTS);
  }
}

/**
 * 导入的信息不一致
 */
export class CoreInconsistentVersionError extends BaseError {
  constructor() {
    const text =
      'We find a latest dependency package installed, please remove the lock file and use "npm update" to upgrade all dependencies first.';
    super(text, FrameworkErrorEnum.INCONSISTENT_VERSION);
  }
}

/**
 * 没有找到定义
 */
export class CoreDefinitionNotFoundError extends BaseError {
  static readonly type = Symbol.for("#NotFoundError");
  static isClosePrototypeOf(ins: CoreDefinitionNotFoundError): boolean {
    return ins ? ins[CoreDefinitionNotFoundError.type] === CoreDefinitionNotFoundError.type : false;
  }
  constructor(identifier: ObjectIdentifier) {
    super(`${identifier.toString()} is not valid in current context`, FrameworkErrorEnum.DEFINITION_NOT_FOUND);
    this[CoreDefinitionNotFoundError.type] = CoreDefinitionNotFoundError.type;
  }
  updateErrorMsg(className: string): void {
    const identifier = this.message.split(" is not valid in current context")[0];
    this.message = `${identifier} in class ${className} is not valid in current context`;
  }
}

export class CoreDuplicateClassNameError extends BaseError {
  constructor(className: string, existPath: string, existPathOther: string) {
    super(
      `"${className}" duplicated between "${existPath}" and "${existPathOther}"`,
      FrameworkErrorEnum.DUPLICATE_CLASS_NAME
    );
  }
}

/**
 * 单例注入到请求
 */
export class CoreSingletonInjectRequestError extends BaseError {
  constructor(singletonScopeName: string, requestScopeName: string) {
    const text = `${singletonScopeName} with singleton scope can't implicitly inject ${requestScopeName} with request scope directly, please add "@Scope(ScopeEnum.Request, { allowDowngrade: true })" in ${requestScopeName} or use "ctx.requestContext.getAsync(${requestScopeName})".`;
    super(text, FrameworkErrorEnum.SINGLETON_INJECT_REQUEST);
  }
}