import {
  HammerheadAuthorization,
  hammerheadDashboardLogin,
  hammerheadSync,
} from '../lib/hammerhead';

export async function POST(req: Request) {
  const { username, password } = await req.json();

  if (!username || !password) {
    return Response.json(
      { message: 'Missing username or password' },
      {
        status: 401,
        statusText: 'Missing username or password',
      }
    );
  }

  let auth: HammerheadAuthorization;
  try {
    auth = await hammerheadDashboardLogin(username, password);
  } catch (err) {
    return Response.json(
      { message: 'Login failed' },
      {
        status: 401,
        statusText: 'Login failed',
      }
    );
  }

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      controller.enqueue(
        encoder.encode(
          `data: ${JSON.stringify({
            message: `Logged in as user ${auth.userId}`,
          })}\n\n`
        )
      );
      controller.enqueue(
        encoder.encode(
          `data: ${JSON.stringify({ message: 'Sync started' })}\n\n`
        )
      );
      try {
        const sync = await hammerheadSync(auth).then((res) =>
          !res.ok ? Promise.reject(new Error(res.statusText)) : res
        );
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({
              message: 'Sync ended',
              status: sync.status,
            })}\n\n`
          )
        );
      } catch (err) {
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({
              message: 'Sync failed',
              error: err?.message || err,
            })}\n\n`
          )
        );
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
    },
  });
}
