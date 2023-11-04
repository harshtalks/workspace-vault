export type NewUserEmailTemplateProps = {
  name: string;
  email: string;
  userId: string;
};

export const NewUserEmailTemplate: React.FC<
  Readonly<NewUserEmailTemplateProps>
> = ({ name, email, userId }) => {
  return (
    <div>
      <h1>Welcome, {name}!</h1>

      <h2>
        Welcome from the <strong>WorkspaceVault Team</strong>
      </h2>

      <p>
        We are excited to have you as a new member! Your account has been
        created with the following details:
      </p>

      <ul>
        <li>Name: {name}</li>
        <li>Email: {email}</li>
        <li>User ID: {userId}</li>
      </ul>

      <p>
        Please let us know if you have any other questions. We are happy to help
        get you started!
      </p>

      <p>Best regards,</p>
      <p>Workspace Vault</p>
    </div>
  );
};
