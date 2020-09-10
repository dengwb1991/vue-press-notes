# providers

> **供应商、提供者**

Providers 是 `Nest` 的一个基本概念。许多基本的 Nest 类可能被视为 `provider` - `service`, `repository`, `factory`, `helper` 等等。 他们都可以通过 `constructor` 注入依赖关系。 这意味着对象可以彼此创建各种关系，并且“连接”对象实例的功能在很大程度上可以委托给 `Nest` 运行时系统。 Provider 只是一个用 `@Injectable()` 装饰器注释的类。

## Dependency injection

> **依赖注入基本原理**

依赖注入是一种控制反转（IoC）技术，您可以将依赖的实例化委派给 IoC 容器（在我们的示例中为 NestJS 运行时系统），而不是必须在自己的代码中执行。 让我们从“提供者”一章中检查此示例中发生的情况。

首先，我们定义一个提供者。@Injectable()装饰器将 CatsService 类标记为提供者。

```js
//cats.service.ts
import { Injectable } from '@nestjs/common'
import { Cat } from './interfaces/cat.interface'

@Injectable()
export class CatsService {
  private readonly cats: Cat[] = []
  
  findAll(): Cat[] {
    return this.cats
  }
}
```

然后，我们要求 Nest 将提供程序注入到我们的控制器类中

```js
//cats.controller.ts
import { Controller, Get } from '@nestjs/common'
import { CatsService } from './cats.service'
import { Cat } from './interfaces/cat.interface'

@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}
  
  @Get()
  async findAll(): Promise<Cat[]> {
    return this.catsService.findAll()
  }
}
```

最后，我们在 Nest IoC 容器中注册提供程序

```js
//app.module.ts
import { Module } from '@nestjs/common'
import { CatsController } from './cats/cats.controller'
import { CatsService } from './cats/cats.service'

@Module({
  controllers: [CatsController],
  providers: [CatsService],
})
export class AppModule {}
```

在整个过程中有三个关键的步骤：

1. 在 cats.service.ts 中 @Injectable() 装饰器声明 CatsService 类是一个可以由Nest IoC容器管理的类。

2. 在 cats.controller.ts 中 CatsController 声明了一个依赖于 CatsService 令牌(token)的构造函数注入:

```js
constructor(private readonly catsService: CatsService)
```

3. 在 `app.module.ts` 文件中，我们将标识 `CatsService` 和 `cats.service.ts` 文件中的类 `CatsService` 联系起来。下面我们将看到这种关联（也叫注册）是如何发生的。

* 当 Nest IoC 容器实例化 CatsController 时，它首先查找所有依赖项*。 当找到 CatsService 依赖项时，它将对 CatsService令牌(token)执行查找，并根据上述步骤（上面的＃3）返回 CatsService 类。 假定单例范围（默认行为），Nest 然后将创建 CatsService 实例，将其缓存并返回，或者如果已经缓存，则返回现有实例。

* 这个解释稍微简化了一点。我们忽略的一个重要方面是，分析依赖项代码的过程非常复杂，并且发生在应用程序引导期间。一个关键特性是依赖关系分析(或“创建依赖关系图”)是可传递的。 在上面的示例中，如果 CatsService 本身具有依赖项，那么那些依赖项也将得到解决。 依赖关系图确保以正确的顺序解决依赖关系-本质上是“自下而上”。 这种机制使开发人员不必管理此类复杂的依赖关系图。

## Standard providers

> **标准供应商**

让我们近距离看看 `@Module()` 装饰器。在 `app.module` 中我们声明：

```js
@Module({
  controllers: [CatsController],
  providers: [CatsService],
})
```

`providers` 属性接受一个提供者数组。到目前为止，我们已经通过一个类名列表提供了这些提供者。实际上，该语法 `providers: [CatsService]` 是更完整语法的简写

```js
providers: [
  {
    provide: CatsService,
    useClass: CatsService,
  }
]
```

现在我们看到了这个显式的构造，我们可以理解注册过程。在这里，我们明确地将令牌 `CatsService` 与类 `CatsService` 关联起来。简写表示法只是为了简化最常见的用例，其中令牌用于请求同名类的实例。


## Custom providers

> **自定义供应商**

当你的需求超过了那些标准供应商所提供的时候发生了什么？这有一些例子：

1. 你想创建一个自定义的实例而不是让Nest实例化（或者返回一个缓存的实例）。
2. 你想要在第二个依赖中重用一个现有的类。
3. 你想要重载一个类用于测试的模拟版本。

Nest允许你定义自定义供应商来处理这些情况。它提供了几种方式来定义自定义供应商。

### 值提供者 (useValue)

`useValue` 语法对于注入常量值、将外部库放入 Nest 容器或使用模拟对象替换实际实现非常有用。假设您希望强制 `Nest` 使用模拟 `CatsService` 进行测试。

```js
import { CatsService } from './cats.service';

const mockCatsService = {
  /* mock implementation
  ...
  */
};

@Module({
  imports: [CatsModule],
  providers: [
    {
      provide: CatsService,
      useValue: mockCatsService,
    },
  ],
})
export class AppModule {}

```

在本例中，CatsService 令牌将解析为 mockCatsService 模拟对象。useValue 需要一个值——在本例中是一个文字对象，它与要替换的 CatsService 类具有相同的接口。由于 TypeScript 的结构类型化，您可以使用任何具有兼容接口的对象，包括文本对象或用 new 实例化的类实例。

到目前为止，我们已经使用了类名作为我们的提供者标记（ providers 数组中列出的提供者中的 Provide 属性的值）。 这与基于构造函数的注入所使用的标准模式相匹配，其中令牌也是类名。有时，我们可能希望灵活使用字符串或符号作为 DI 令牌。 例如：

```js
import { connection } from './connection';

@Module({
  providers: [
    {
      provide: 'CONNECTION',
      useValue: connection,
    },
  ],
})
export class AppModule {}
```

在本例中，我们将字符串值令牌 `('CONNECTION')` 与从外部文件导入的已存在的连接对象相关联。

:::warning
除了使用字符串作为令牌之外，还可以使用JavaScript Symbol。
:::

我们前面已经看到了如何使用基于标准构造函数的注入模式注入提供者。此模式要求用类名声明依赖项。'CONNECTION' 自定义提供程序使用字符串值令牌。让我们看看如何注入这样的提供者。为此，我们使用 @Inject() 装饰器。这个装饰器只接受一个参数——令牌。

```js
@Injectable()
export class CatsRepository {
  constructor(@Inject('CONNECTION') connection: Connection) {}
}
```

:::warning
@Inject()装饰器是从@nestjs/common包中导入的。
:::

虽然我们在上面的例子中直接使用字符串 `'CONNECTION'` 来进行说明，但是为了清晰的代码组织，最佳实践是在单独的文件（例如 `constants.ts` ）中定义标记。 对待它们就像对待在其自己的文件中定义并在需要时导入的符号或枚举一样。

### 类提供者 (useClass)

`useClass` 语法允许您动态确定令牌应解析为的类。 例如，假设我们有一个抽象（或默认）的 `ConfigService` 类。 根据当前环境，我们希望 `Nest` 提供配置服务的不同实现。 以下代码实现了这种策略。

```js
const configServiceProvider = {
  provide: ConfigService,
  useClass:
    process.env.NODE_ENV === 'development'
      ? DevelopmentConfigService
      : ProductionConfigService,
};

@Module({
  providers: [configServiceProvider],
})
export class AppModule {}
```

让我们看一下此代码示例中的一些细节。 您会注意到，我们首先定义对象 `configServiceProvider`，然后将其传递给模块装饰器的 `providers` 属性。 这只是一些代码组织，但是在功能上等同于我们到目前为止在本章中使用的示例。

另外，我们使用 `ConfigService` 类名称作为令牌。 对于任何依赖 `ConfigService` 的类，Nest 都会注入提供的类的实例（ `DevelopmentConfigService` 或 `ProductionConfigService`），该实例将覆盖在其他地方已声明的任何默认实现（例如，使用 @Injectable() 装饰器声明的 `ConfigService`）

### 工厂提供者 (useFactory)

`useFactory` 语法允许动态创建提供程序。实工厂函数的返回实际的 `provider` 。工厂功能可以根据需要简单或复杂。一个简单的工厂可能不依赖于任何其他的提供者。更复杂的工厂可以自己注入它需要的其他提供者来计算结果。对于后一种情况，工厂提供程序语法有一对相关的机制:

工厂函数可以接受(可选)参数。

`inject` 属性接受一个提供者数组，在实例化过程中，`Nest` 将解析该数组并将其作为参数传递给工厂函数。这两个列表应该是相关的: `Nest` 将从 `inject` 列表中以相同的顺序将实例作为参数传递给工厂函数。

下面示例演示：

```js
const connectionFactory = {
  provide: 'CONNECTION',
  useFactory: (optionsProvider: OptionsProvider) => {
    const options = optionsProvider.get();
    return new DatabaseConnection(options);
  },
  inject: [OptionsProvider],
};

@Module({
  providers: [connectionFactory],
})
export class AppModule {}
```

### 别名提供者 (useExisting)

useExisting 语法允许您为现有的提供程序创建别名。这将创建两种访问同一提供者的方法。在下面的示例中，(基于string)令牌 'AliasedLoggerService' 是(基于类的)令牌 LoggerService 的别名。假设我们有两个不同的依赖项，一个用于 'AlilasedLoggerService' ，另一个用于 LoggerService 。如果两个依赖项都用单例作用域指定，它们将解析为同一个实例。

```js
@Injectable()
class LoggerService {
  /* implementation details */
}

const loggerAliasProvider = {
  provide: 'AliasedLoggerService',
  useExisting: LoggerService,
};

@Module({
  providers: [LoggerService, loggerAliasProvider],
})
export class AppModule {}
```

### 非服务提供者

虽然提供者经常提供服务，但他们并不限于这种用途。提供者可以提供任何值。例如，提供程序可以根据当前环境提供配置对象数组，如下所示:

```js
const configFactory = {
  provide: 'CONFIG',
  useFactory: () => {
    return process.env.NODE_ENV === 'development'
      ? devConfig
      : prodConfig;
  },
};

@Module({
  providers: [configFactory],
})
export class AppModule {}
```

### 导出自定义提供者

与任何提供程序一样，自定义提供程序的作用域仅限于其声明模块。要使它对其他模块可见，必须导出它。要导出自定义提供程序，我们可以使用其令牌或完整的提供程序对象。

以下示例显示了使用 token 的例子：

```js
const connectionFactory = {
  provide: 'CONNECTION',
  useFactory: (optionsProvider: OptionsProvider) => {
    const options = optionsProvider.get();
    return new DatabaseConnection(options);
  },
  inject: [OptionsProvider],
};

@Module({
  providers: [connectionFactory],
  exports: ['CONNECTION'],
})
export class AppModule {}
```

**or**

```js
const connectionFactory = {
  provide: 'CONNECTION',
  useFactory: (optionsProvider: OptionsProvider) => {
    const options = optionsProvider.get();
    return new DatabaseConnection(options);
  },
  inject: [OptionsProvider],
};

@Module({
  providers: [connectionFactory],
  exports: [connectionFactory],
})
export class AppModule {}
```