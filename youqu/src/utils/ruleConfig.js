const Config = {
  numberConfig: {
    rules: [{
      required: true,

      message: '*必填项,最长20个正数！',
    }],
  },
  selectConfig: {
    rules: [{
      required: true,
      message: '*必填项！',
    }],
  },
  inputConfig: {
    rules: [{
      required: true,
      message: '*必填项,最长20个字符！',
      max: 20,
    }],
  },
  weightConfig: {
    rules: [{
      required: true,
      message: '*必填项,最长32个字符！',
      max: 32,
    }],
  },
  textAreaConfigLarge: {
    rules: [{
      required: true,
      message: '*必填项,最长500个字符！',
      max: 500,
    }],
  },
  textAreaConfigSmall: {
    rules: [{
      required: true,
      message: '*必填项,最长200个字符！',
      max: 200,
    }],
  },
  inputMaxConfig: {
    rules: [{
      required: false,
      message: '*最长32个字符！',
      max: 32,
    }],
  },
  inputMaxConfig2: {
    rules: [{
      required: false,
      message: '*最长36个字符！',
      max: 36,
    }],
  },
  textAreaMaxConfigLarge: {
    rules: [{
      required: false,
      message: '*最长500个字符！',
      max: 500,
    }],
  },
  textAreaMaxConfigSmall: {
    rules: [{
      required: false,
      message: '*最长200个字符！',
      max: 200,
    }],
  },
  textAreaMaxConfigSmaller: {
    rules: [{
      required: false,
      message: '*最长100个字符！',
      max: 100,
    }],
  },
  valueLowerLimitConfig: {
    rules: [{
      required: true,
      message: '*必填项,不能小于0',
    }],
  },
  valueUpperLimitConfig: {
    rules: [{
      message: '不能小于50，大于150',
      max: 150,
    }],
  },
};
export const onInput = (e, maxLength) => {
  if (getLen(e.target.value) > maxLength) { e.target.value = limitMaxLength(e.target.value, maxLength); }
};
export function getLen(str) {
  console.log('长度',str.replace(/[^ -~]/g, 'AA').length);
  return str.replace(/[^ -~]/g, 'AA').length;
}
function limitMaxLength(str, maxLength) {
  let result = [];
  for (let i = 0; i < maxLength; i++) {
    let char = str[i];
    if (/[^ -~]/.test(char))
    {maxLength--;}
    result.push(char);
  }
  return result.join('');
}
export default Config;