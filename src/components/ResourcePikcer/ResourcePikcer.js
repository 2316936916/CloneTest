import { memo } from 'react';
import PropTypes from 'prop-types';
import useResource from 'hooks/useResource';
import useResourceUpload from 'hooks/useResourceUpload';
import Button from 'components/Button';

const ResourcePikcer = memo(({
  onChange,
}) => {
  const getResource = useResource('blob');
  const { action } = useResourceUpload((ret) => {
    onChange(ret._id);
  });

  return (
    <Button
      type="primary"
      onClick={async () => {
        const ret = await getResource();
        action(ret);
      }}
    >
      upload
    </Button>
  );
});

ResourcePikcer.propTypes = {
  onChange: PropTypes.func,
};

export default ResourcePikcer;
