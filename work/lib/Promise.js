/* 
Promise构造函数模块
*/
(function (window) {
  
  /* 
  Promise构造函数
  */
  function Promise(excutor) {
    const self = this // 将promise对象保存到self
    self.status = 'pending' // 状态标识名称的属性status, 初始值为pending, 代表结果还未确定
    self.data = undefined //  用来存储结果数据的属性data, 初始值为undefine, 代表现在还没数据
    self.callbacks = [] // 用来存储待执行的成功和失败的回调的数组容器, 每个元素的结构: {onResolved(){}, onRejected(){}}
    /* 
    用来指定promise成功的状态和成功的value
      1). 指定status改为'resolved'
      2). 指定data为value
      3). 可能需要去执行已保存的待执行成功的回调函数
    */
    function resolve(value) {
      // 1). 指定status改为'resolved'
      self.status = 'resolved'
      // 2). 指定data为value
      self.data = value
      // 3). 可能需要去执行已保存的待执行成功的回调函数
        // 回调函数必须异步执行
      if (self.callbacks.length > 0) {
        setTimeout(() => { // 本来需要使用微列队, 但js操作太麻烦, 简单使用宏列队
          self.callbacks.forEach(callbackObj => {
            callbackObj.onResolved(value) // 即使数据和回调函数都有了, 也需要将回调函数放到回调队列中执行
          })
        }, 0)
      }
    }

    /* 
    用来指定promise失败的状态和失败的reason
      1).指定status改为 'rejected'
      2).指定data为reason
      3).可能需要去执行已保存的待执行失败的回调函数
    */
    function reject(reason) {
      // 1).指定status改为 'rejected'
      self.status = 'rejected'
      // 2).指定data为reason
      self.data = reason
      // 3).可能需要去执行已保存的待执行失败的回调函数
        // 回调函数必须异步执行
      if (self.callbacks.length > 0) {
        setTimeout(() => { // 本来需要使用微列队, 但js操作太麻烦, 简单使用宏列队
          self.callbacks.forEach(callbackObj => {
            callbackObj.onRejected(reason) // 即使数据和回调函数都有了, 也需要将回调函数放到回调队列中执行
          })
        }, 0)
      }
    }

    // 立即同步执行器函数(去启动异步任务)
    try {
      excutor(resolve, reject)
    } catch (error) { // 一旦执行器执行抛出异常, promise变为失败, 且结果数据为error
      reject(error)
    }
    
  }

  /* 
  用来指定成功和失败回调函数的方法
  */
  Promise.prototype.then = function (onResolved, onRejected) {
    const self = this

    return new Promise((resolve, reject) => {

      /* 
      调用传入的成功/失败的回调, 执行后根据结果来确定返回的promise的结果
      */
      function handle(callback) {
        try {
          const result = callback(self.data)
          // result是promise
          if (result instanceof Promise) { // result的结果决定返回的promise的结果
            /* 
            result.then(
              value => { // 如果result成功了, 返回promise也成功, 值就是接收的value
                resolve(value)
              },
              reason => { // 如果result失败了, 返回promise也失败, 值就是接收的reason
                reject(reason)
              }
            ) */
            result.then(resolve, reject)
          } else { // result不是promise
            resolve(result)
          }
        } catch (error) {
          reject(error)
        }
      }


      if (self.status === 'resolved') { // 已经成功了
        // 进行成功的异步进行处理
        setTimeout(() => {
          handle(onResolved)
        }, 0)

      } else if (self.status === 'rejected') { // 已经失败了
        // 进行失败的异步进行处理
        setTimeout(() => {
          handle(onRejected)
        }, 0)
      } else { // pending 还未确定
        // 向promise中的callbacks中保存2个待执行的回调函数
        this.callbacks.push({
          onResolved: (value) => {
             // 进行成功处理
            handle(onResolved)
          },
          onRejected: (reason) => {
            // 进行失败处理
            handle(onRejected)
          }
        })
      }
    })
    
  }
  /* 
  用来指定失败回调函数的方法
  */
  Promise.prototype.catch = function (onRejected) {
    
  }

  /* 
  用来返回一个成功的promise的静态方法
  */
  Promise.resolve = function (value) {

  }

  /* 
  用来返回一个失败的promise的静态方法
  */
  Promise.reject = function (reason) {

  }

  /* 
  用来返回一个promise的静态方法
    所有的promises都成功, 返回的promise才成功
    只要有一个失败了, 返回的promise就失败了
  */
  Promise.all = function (promises) {

  }

  /* 
  用来返回一个promise的静态方法
  第一个确定结果的promise来决定返回promise结果
  */
  Promise.race = function (promises) {

  }


  window.Promise = Promise
})(window)