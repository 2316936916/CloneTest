import { Fragment, useMemo } from 'react';
import { css } from '@emotion/react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import Item from './Item';
import useStore from '../useStore';

const Toastr = () => {
  const { state, dispatch } = useStore();
  const { toastrList } = state;

  const toastrPositionList = useMemo(() => toastrList.filter((item) => !item.position), [toastrList]);

  return ReactDOM.createPortal(
    (
      <Fragment>
        {
          !_.isEmpty(toastrPositionList) && (
            <div
              css={css`
              position: fixed;
              top: 1rem;
              right: 1rem;
              z-index: 2001;
              > div:not(:last-child) {
                margin-bottom: 0.6rem;
              }
            `}
            >
              {
                toastrPositionList
                  .map((item) => (
                    <Item
                      key={item._id}
                      item={item}
                      onRemove={dispatch.removeToastr}
                    />
                  ))
              }
            </div>
          )
        }
        {
          toastrList
            .filter((item) => item.position)
            .map((item) => (
              <Item
                key={item._id}
                item={item}
                onRemove={dispatch.removeToastr}
              />
            ))
        }
      </Fragment>
    ),
   document.body,
);
};

export default Toastr;
