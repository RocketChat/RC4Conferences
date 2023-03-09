const nextDeployUrl =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const unsignCook = async (hash) => {
  const res = await fetch(`${nextDeployUrl}/api/conf/unsignCook`, {
    method: 'POST',
    body: JSON.stringify(hash),
  });
  return res.json();
};
