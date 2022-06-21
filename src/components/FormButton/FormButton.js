import { css } from '@emotion/react';
import Button from 'components/Button';
import Icon from 'components/Icon';
function FormButton(){
    return(
        <div css={css`background:#fff;padding:1.5rem 1.5rem 0 1.5rem;`}>
          <Button css={css`background:#1B3194;color:#fff;margin-right:1rem;font-size:1rem;position:relative;top: 2px;height:2.6rem;border: 1px solid #ccc;`}><Icon code="eb18" color="#fff" css={css`position:relative;left:-3px;`}/>新增</Button>
          <Button css={css`color:#000;margin-right:1rem;height:2.6rem;border: 1px solid #ccc;`}>修改</Button>
          <Button css={css`color:#000;margin-right:1rem;height:2.6rem;border: 1px solid #ccc;`}>删除</Button>
          <Button css={css`color:#000;margin-right:1rem;height:2.6rem;border: 1px solid #ccc;`}>导出</Button>
        </div>
    )
}
export default FormButton