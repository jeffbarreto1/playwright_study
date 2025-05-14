import { test, expect } from '@playwright/test';

const BASE_URL = 'https://reqres.in/api'

test('GET - List users', async ({ request  }) => {
  
  const response = await request.get(`${BASE_URL}/users?page=2`, {
    headers: {
      'x-api-key': 'reqres-free-v1'
    }
  });
  expect(response.status()).toBe(200);
  const responseBody = await response.json();

  for (const user of responseBody.data) {
    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('first_name');
    expect(user).toHaveProperty('last_name');
    expect(user).toHaveProperty('email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    expect(user.email).toMatch(emailRegex);
  };   
});

test('POST and PUT - created users', async ({ request  }) => {
  
  const response = await request.post(`${BASE_URL}/users`, {
    headers: {
      'x-api-key': 'reqres-free-v1'
    },
    data: {
      name: 'Krishna',
      job: 'Analyst QA',
    }
  });
  expect(response.status()).toBe(201);

  const userBefore = {
    "name": "Jefferson",
    "job": "Analista"
  }

  const updateResponse = await request.put(`${BASE_URL}/users/2`, {
      headers: {
        'x-api-key': 'reqres-free-v1'
      },
      data: userBefore
  });
  expect(updateResponse.status()).toBe(200);
  const userAfter = await updateResponse.json();

  expect (userAfter.name).toBe(userBefore.name);
  expect (userAfter.job).toBe(userBefore.job);
  expect (userAfter).toHaveProperty('updatedAt');
});

test.skip('DELETE', async ({request}) => {
  const response = await request.delete(`${BASE_URL}/users/999`, {
    headers: {
      'x-api-key': 'reqres-free-v1'
    },
  });
  expect(response.status()).toBe(404); //A API está sempre retornando 204
});

test('DELETE Time-Out', async ({request}) => {
  const tm = 1000;
  try {
    const response = await request.delete(`${BASE_URL}/users/999?delay=3`, {
    headers: {
      'x-api-key': 'reqres-free-v1'
    },
    timeout: tm,
    });
    expect(response.status()).toBe(404)
  } catch (error) {
    expect(error.message).toContain('apiRequestContext.delete: Request timed out after 1000ms');
  }
});


