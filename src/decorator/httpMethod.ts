import 'reflect-metadata'
import { ROUTER_MAP } from '../constant/constant'

// 装饰器（Decorator） 仅提供定义劫持，能够对类及其方法、方法入参、属性的定义并没有提供任何附加元数据的功能。
// 注解（Annotation） 仅提供附加元数据支持，并不能实现任何操作。

/**
 * @desc 生成 http method 装饰器, 该装饰器是个方法装饰器
 * @param {string} method - http method，如 get、post、head
 * @return Decorator - 装饰器
 */
// 这里就是用个工厂模式包装了一下，其实感觉也算是闭包的应用
function createMethodDecorator(method: string) {
  // 装饰器接收路由 path 及 isVerify 作为参数
  return function httpMethodDecorator(path: string, isVerify?: boolean) {
    return (proto: any, name: string) => {
      // proto 就是当前的装饰器装饰的那个方法
      // name 是当前装饰的那个方法的名字
      const target = proto.constructor;
      // 先将已有的路由元数据取出来，没有的话就说明是第一次，则初始化为[]
      const routeMap = Reflect.getMetadata(ROUTER_MAP, target, 'method') || [];
      // 向路由元数据这个数组里添加当前的路由方法  对象里的数据分别代表 {方法名，请求名，路由路径，是否验证}
      routeMap.push({ name, method, path, isVerify: !!isVerify });
      // 重新定义该元数据，如果原来就有，则覆盖
      Reflect.defineMetadata(ROUTER_MAP, routeMap, target, 'method');
    };
  };
}

// 导出 http method 装饰器
export const post = createMethodDecorator('post');

export const get = createMethodDecorator('get');

export const del = createMethodDecorator('delete');

export const put = createMethodDecorator('put');

export const patch = createMethodDecorator('patch');

export const options = createMethodDecorator('options');

export const head = createMethodDecorator('head');

export const all = createMethodDecorator('all');