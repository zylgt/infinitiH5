import { message } from 'antd';

export function config() {
  return {
    onError(err) {
      err.preventDefault();
      // message.error('请检查网络');
    }
  };
}
