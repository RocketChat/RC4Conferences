export default async function (req, res) {
  const { username, password } = req.body;

  const request = await fetch(
    `${process.env.NEXT_PUBLIC_RC_URL}/api/v1/login`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user: username,
        password,
      }),
    }
  );
  const response = await request.json();

  if (response?.error === 'totp-required') {
    return res
      .status(401)
      .send({ authenticated: false, error: 'totp-required' });
  }

  return res.status(200).send({ authenticated: true });
}
