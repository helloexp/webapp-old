import expect from 'expect';
import authReducer, {
  LOGIN_SUCCESS,
  SAVE_TOKEN,
  LOGOUT,
} from '../auth';

describe('redux/modules/account/auth', () => {
  const tokenResponse = {
    access_token: 'faa1df2feb03164a357f4ccf446688d731688ad6',
    token_type: 'Bearer',
    expires_in: 1465577900,
    id_token: [
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6ImtleTEifQ.',
      'eyJpc3MiOiJodHRwczovL3Rlc3QyLnVuaXFsby5jb20vanAvYXV0aCIsInN1YiI6IjcwMTQ0M',
      'zE5NDU4OTUiLCJhdWQiOiJwcm9maWxlLWpwIiwiZXhwIjoxNDY1NTc4MTAwLCJpYXQiOjE0NjU1N',
      'zYzMDAsImF1dGhfdGltZSI6MTQ2NTU2MzMxMCwiYXRfaGFzaCI6IlN2MnktT1F4WWpkcnFmV1Fxc09',
      'zS0EiLCJnZHNtZW1iZXJpZCI6eyJVUSI6NzAxNDQzMTk0NTg5NSwiR1UiOjc2MDg5NTA1ODExODZ9fQ.',
      'fLm5TplkMwG1lEDCyIoLEd0QWoCXc5LTgqGOQDv-Bs213afF60D_yJPRqwqFnG13X5Iviu64kIjG',
      '-893uXhEXkLAIHjg9qsyAAfE96c4PBXKd-grbkBVpIQit1MyaFkRbvdCJ4oN6ccyyS4fp_nxw3Ea',
      'P6Q4q9GuQd0ij9U_7qcILa7hG-45NOo7EexbALy5pBSx5eLcYeQYs8dyulI20IC4X1-TFwcp_',
      'c5tpOOPgV14NshK2KYkDMQRyJgAtHOyE5_9KfyZs2jMtbM-uK3_hL3YEsndQKzOgUzymWlvfZD',
      'CCwm1jCdyfrYMwqJwT_2tEixD_LKWaSaN2ft7qj_0jQ',
    ].join(''),
  };

  it('should add the token to the state', () => {
    expect(
      authReducer({ user: { gdsSession: '123' } }, {
        type: LOGIN_SUCCESS,
        result: tokenResponse,
      })
    ).toMatch({
      user: {
        tokenExpiresIn: 1465577900,
        accessToken: 'faa1df2feb03164a357f4ccf446688d731688ad6',
        memberId: 7014431945895,
      },
    });
  });

  it('should save token to cookie', () => {
    expect(
      authReducer(undefined, {
        type: SAVE_TOKEN,
        localStorageValue: {
          tokenExpiresIn: 1465577900,
          accessToken: 'faa1df2feb03164a357f4ccf446688d731688ad6',
          memberId: 7014431945895,
        },
      })
    ).toMatch({
      user: {
        tokenExpiresIn: 1465577900,
        accessToken: 'faa1df2feb03164a357f4ccf446688d731688ad6',
        memberId: 7014431945895,
      },
    });
  });

  it('should remove token from state when loging out', () => {
    expect(
      authReducer({ user: { accessToken: '123', memberId: '123' } }, {
        type: LOGOUT,
      })
    ).toMatch({
      user: null,
    });
  });
});
