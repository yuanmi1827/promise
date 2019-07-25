(function(window) {
	/**
     *Promise 构造函数
     *
     * @param {*} excutor 构造器函数
     */
	function Promise(excutor) {
		let self = this; //保存this
		self.status = 'pending' //保存promise状态
		self.data = 'undefined'//用来存储结果数据
		self.callbacks = [] //用来存储等待执行的成功和失败的回调

		/**
         *用来指定promise成功的状态和成功的value
         *
         * @param {*} value
         */
		function resolve(value) {
			self.status = 'resolved' //更改status状态
			self.data = value

			//可能需要去执行已经保存带成功回调的函数
			if (self.callbacks.length > 0) {
				setTimeout(() => {
					self.callbacks.forEach((callback) => {
						callback.onResolve(value)
					})
				}, 0)
			}
		}

		/**
         *用来指定promise失败状态的和失败的value
         *
         * @param {*} reason
         */
		function reject(reason) {
			self.status = 'rejected'
			self.data = reason

			//可能需要去执行已经保存带失败回调的函数
			if (self.callbacks.length > 0) {
				setTimeout(() => {
					self.callbacks.forEach((callback) => {
						callback.onReject(reason)
					})
				}, 0)
			}
		}

		//
		try {
			excutor(resolve, reject);
		} catch (error) {
			reject(error)
		}
	}

    /** 
     * 返回值为一个promise对象
     */
	Promise.prototype.then = function(onResolve, onReject) {
        const self = this
        onResolve = typeof onResolve === 'function' ? onResolve : value => value
        onReject = typeof onReject === 'function' ? onReject : reason => {throw reason}
        return new Promise((resolve,reject)=>{

            if (self.status === 'resolved') {
                //成功的异步回调
                setTimeout(()=>{
                   try{
                    const result = onResolve(self.data)
                    if(result instanceof Promise){
                        //  result.then((value)=>{
                        //      resolve(value)
                        //  },(reason)=>{
                        //      reject(reason)
                        //  })
                         result.then(resolve,reject)
                    }else{
                         resolve(result)
                    }
                   }catch(err){
                        reject(error)
                   }
                },1000)
            
	    	} else if (self.status === 'rejected') {
                setTimeout(()=>{
                   
                    const result = onReject(self.data)
                    if(result instanceof Promise){
                        result.then((value)=>{
                            resolve(value)
                           
                        },(reason)=>{
                            reject(result)
                        })
                    }else{
                        reject(result)
                    }

                },1000)
		    } else {
			    //存储回调函数到callbacks
			    self.callbacks.push({
				    onResolve : (value)=>{
                        try{
                            const result = onResolve(self.data)
                        if(result instanceof Promise){
                            result.then(resolve,reject)
                        }else{
                            resolve(result)
                        }
                        }catch(error){
                            reject(error)
                        }
                    },
				    onReject : (reason)=>{
                        try{
                            const result = onReject(self.data)
                            if(result instanceof Promise){
                                result.then((value)=>{
                                    resolve(value)
                                },(reason)=>{
                                    reject(reason)
                                })
                            }else{
                                reject(result)
                            }
                        }catch(error){
                            reject(error)
                        }
                    }
			    })
		    }
        })
		
		
	}

    /**
     * catch方法 
     */
    Promise.prototype.catch = function(onReject){
        return this.then(null,onReject)
    }

    Promise.all=function(){
    
    
    }
    
    Promise.race=function(){}
    Promise.prototype.xxx=function(){}

	
    Promise.resolve=function(value){
        return new Promise((resolve,reject)=>{
            if(value instanceof Promise){
                value.then(resolve,reject)
            }else{
                resolve(value)
            }
        })
    }

    Promise.reject=function(reason){
        return new Promise((resolve,reject)=>{
           reject(reason)

        })
    }
	//暴露promise
	window.Promise = Promise
})(window)
