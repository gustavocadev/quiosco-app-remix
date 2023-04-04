import type { Customer } from '@prisma/client';
import { createCookieSessionStorage, redirect } from '@remix-run/node';
import { prisma } from '~/utils/db.server';
import { nanoid } from 'napi-nanoid';

export const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    cookie: {
      name: '__session',
      httpOnly: true,
      secrets: ['ThisIsASecret'],
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax',
      maxAge: 60 * 60 * 8,
    },
  });

export const getUser = async (request: Request) => {
  const session = await getUserSession(request);

  const userId = session.get('userId');

  if (!userId) return null;

  const user = await prisma.customer.findFirst({
    where: {
      id: userId,
    },
  });

  return user;
};

export const getUserSession = async (request: Request) => {
  const session = await getSession(request.headers.get('Cookie'));
  return session;
};

export const createUserSession = async (request: Request, userId: string) => {
  const session = await getUserSession(request);

  // console.log(session.id, 'session id');
  // this gonna save the user id in the session.data
  session.set('userId', userId);

  return redirect('/category/cafe', {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  });
};

export const login = async (email: string, password: string) => {
  const user = await prisma.customer.findFirst({
    where: {
      email,
    },
  });

  if (!user) return null;

  if (user.password !== password) return null;

  return {
    id: user.id,
    email: user.email,
  };
};

export const signup = async (
  user: Omit<Customer, 'id' | 'address' | 'phone' | 'username'>
) => {
  const newUser = await prisma.customer.create({
    data: {
      email: user.email,
      name: user.name,
      password: user.password,
      lastName: user.lastName,
      username: `${user.name.toLowerCase()}${user.lastName.toLowerCase()}-${nanoid()}`,
    },
  });
  await prisma.cart.create({
    data: {
      customerId: newUser.id,
    },
  });

  return {
    msg: 'User created',
    success: true,
  };
};

export const isUserAuthenticated = async (request: Request) => {
  const user = await getUser(request);

  return user ? true : false;
};

export const logout = async (request: Request) => {
  const session = await getUserSession(request);

  return redirect('/login', {
    headers: {
      'Set-Cookie': await destroySession(session),
    },
  });
};
