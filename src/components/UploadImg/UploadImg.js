// yys,图片上传到服务器,暂用
import { useState, memo } from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import useResource from 'hooks/useResource';
import useResourceUpload from 'hooks/useResourceUpload';
import Icon from 'components/Icon';

const UploadImg = memo(({
 onUpload,
 defaultValue = '',
 width = '6rem',
 height = '8rem',
}) => {
    const [img, setImg] = useState(defaultValue);
    const getResource = useResource('blob');
    const { action: fileupload } = useResourceUpload((ret) => {
      if (onUpload) {
        onUpload(ret._id);
      }
      setImg(`${ret._id}`);
    });
    return (
        (img === '' || img === null)
      ? (
        <a
          onClick={async () => { fileupload(await getResource()); }}
          css={css`
            width: ${width};
            height: ${height};
            background: rgba(249, 249, 249, 1);
            display:flex;
            justify-content: center;
            align-items: center;
            border: 1px dashed #A3A3A3;
            cursor: pointer;
        `}
        >
          <Icon
            code="e625"
            css={css`
            width: 1.6rem;
            height: 1.6rem;
        `}
          />
        </a>
) : (
  <a
    onClick={async () => { fileupload(await getResource()); }}
    css={css`
      position: relative;
      width: ${width};
      height: ${height};
      display:flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      &:hover{
        .replace{
            opacity: 1;
        }
      }
  `}
  >
    <img
      src={`${RESOURCE_PATHNAME_GET}/${img}`}
      alt="pic"
      css={css`
      width: ${width};
      height: ${height};
    `}
    />
    <div
      className="replace"
      css={css`
      position: absolute;
      top: 0;
      width: ${width};
      height: ${height};
      display:flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background: rgba(0, 0, 0, 0.63);
      opacity: 0;
  `}
    >
      <Icon
        code="e66d"
        color="#fff"
        css={css`
            width: 2rem;
            height: 2rem;
            margin-bottom: 0.5rem;
        `}
      />
      <span css={css`
            color: #fff;
            font-weight: 400;
        `}
      >
        替换
      </span>
    </div>
  </a>
)
    );
});

UploadImg.propTypes = {
  onUpload: PropTypes.func,
  defaultValue: PropTypes.string,
  width: PropTypes.string,
  height: PropTypes.string,
};

export default UploadImg;
