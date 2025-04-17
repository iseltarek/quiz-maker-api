/* eslint-disable prettier/prettier */
export class ErrorMessages {
  static readonly auth = {
    missing_token: 'Access denied. No authentication token provided.',
    invalid_token_format: 'Access denied. Invalid authentication token format.',
    blacklisted_token:
      'Access denied. The provided token has been blacklisted.',
    unauthorized:
      'Access denied. You are not authorized to perform this action.',
    login_google_error: 'Google login failed: No email returned',
  };

  static readonly user = {
    invalid_email_or_password: 'Invalid email or password. Please try again.',
    user_exist: 'A user with this email already exists.',
    user_creation_failed:
      'An error occurred while creating the user. Please try again later.',
    user_not_found: 'No user found with the provided details.',
  };

  static readonly permission = {
    only_owner: 'Only the owner can perform this action on this todo',
    read_only: 'You do not have permission to modify this todo',
    not_accessible: 'You do not have access to todo',
  };
}
