const fs = require('fs');

export const cleanup = async (asset: string): Promise<void> => {
  fs.unlinkSync(asset);
};
