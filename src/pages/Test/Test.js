import { memo } from 'react';

const Test = memo(() => {
    console.log('这是测试');
return (
  <div>
    测试
  </div>
);
});

export default Test;
