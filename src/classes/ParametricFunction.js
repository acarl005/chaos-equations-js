const BASE27 = "_ABCDEFGHIJKLMNOPQRSTUVWXYZ"
const FLT_MAX = 1e+37
export const paramsDimensions = ["x", "y"]
export const paramsTerms = ["xx", "yy", "tt", "xy", "xt", "yt", "x", "y", "t"]


export default class ParametricFunction {
  
  static fromCode(code) {
    const paramsArr = []
    for (let i = 0; i < Math.floor(18 / 3); i++) {
      let a = 0
      const c = i < code.length ? code[i] : "_"
      if (c >= "A" && c <= "Z") {
        a = Math.floor(c.charCodeAt(0) - 65) + 1
      } else if (c >= "a" && c <= "z") {
        a = Math.floor(c.charCodeAt(0) - 97) + 1
      }
      paramsArr[i * 3 + 2] = (a % 3) - 1.0
      a = Math.floor(a / 3)
      paramsArr[i * 3 + 1] = (a % 3) - 1.0
      a = Math.floor(a / 3)
      paramsArr[i * 3 + 0] = (a % 3) - 1.0
    }
    const paramsObj = {}
    for (let d = 0; d < paramsDimensions.length; d++) {
      const dim = paramsObj[paramsDimensions[d]] = {}
      for (let i = 0; i < paramsTerms.length; i++) {
        dim[paramsTerms[i]] = paramsArr[d * paramsTerms.length + i]
      }
    }
    return new ParametricFunction(paramsObj)
  }

  static random() {
    const paramsObj = {}
    paramsDimensions.forEach(dim => {
      paramsObj[dim] = {}
      paramsTerms.forEach(term => {
        paramsObj[dim][term] = Math.floor(Math.random() * 3) - 1
      })
    })
    return new ParametricFunction(paramsObj)
  }

  constructor(params) {
    this.params = params
  }

  toCode() {
    let a = 0
    let n = 0
    const result = []
    for (let dim of paramsDimensions) {
      for (let term of paramsTerms) {
        a = a * 3 + parseInt(this.params[dim][term] || 0) + 1
        n += 1
        if (n == 3) {
          result.push(BASE27[a])
          a = 0
          n = 0
        }
      }
    }
    return result.join("")
  }

  evaluate(x, y, t) {
    const xx = Math.min(Math.max(x * x, -FLT_MAX), FLT_MAX)
    const yy = Math.min(Math.max(y * y, -FLT_MAX), FLT_MAX)
    const tt = Math.min(Math.max(t * t, -FLT_MAX), FLT_MAX)
    const xy = Math.min(Math.max(x * y, -FLT_MAX), FLT_MAX)
    const xt = Math.min(Math.max(x * t, -FLT_MAX), FLT_MAX)
    const yt = Math.min(Math.max(y * t, -FLT_MAX), FLT_MAX)
    const xp = Math.min(Math.max(x, -FLT_MAX), FLT_MAX)
    const yp = Math.min(Math.max(y, -FLT_MAX), FLT_MAX)
    const tp = Math.min(Math.max(t, -FLT_MAX), FLT_MAX)

    const p = this.params
    const newX = xx * p.x.xx + yy * p.x.yy + tt * p.x.tt +
                 xy * p.x.xy + xt * p.x.xt + yt * p.x.yt +
                 xp * p.x.x  + yp * p.x.y  + tp * p.x.t

    const newY = xx * p.y.xx + yy * p.y.yy + tt * p.y.tt +
                 xy * p.y.xy + xt * p.y.xt + yt * p.y.yt +
                 xp * p.y.x  + yp * p.y.y  + tp * p.y.t 

    return { x: newX, y: newY }
  }
}

