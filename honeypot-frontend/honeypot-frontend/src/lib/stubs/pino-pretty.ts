type PrettyOptions = Record<string, unknown>;

const noopStream = {
  write: () => {},
};

const pinoPretty = (_options?: PrettyOptions) => {
  void _options;
  return noopStream;
};

export default pinoPretty;
export { pinoPretty };
