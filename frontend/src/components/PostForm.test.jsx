import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PostForm from './PostForm';
import { MockedProvider } from '@apollo/client/testing';
import '@testing-library/jest-dom';

const mockRouterPush = jest.fn();
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: mockRouterPush,
    events: { on: jest.fn(), off: jest.fn(), emit: jest.fn() },
  }),
}));

const defaultProps = {
  post: null,
  onSuccess: jest.fn(),
};

describe('PostForm', () => {
  it('renders empty form for new post', () => {
    render(
      <MockedProvider>
        <PostForm {...defaultProps} />
      </MockedProvider>
    );
    expect(screen.getByLabelText(/title/i)).toHaveValue('');
    expect(screen.getByLabelText(/author/i)).toHaveValue('');
    expect(screen.getByLabelText(/content/i)).toHaveValue('');
  });

  it('renders form with initial values for edit', () => {
    render(
      <MockedProvider>
        <PostForm post={{ id: '1', title: 'T', content: 'C', author: 'A' }} />
      </MockedProvider>
    );
    expect(screen.getByLabelText(/title/i)).toHaveValue('T');
    expect(screen.getByLabelText(/author/i)).toHaveValue('A');
    expect(screen.getByLabelText(/content/i)).toHaveValue('C');
  });

  it('shows live markdown preview', () => {
    render(
      <MockedProvider>
        <PostForm {...defaultProps} />
      </MockedProvider>
    );
    fireEvent.change(screen.getByLabelText(/content/i), { target: { value: '**bold**' } });
    expect(screen.getByText('bold')).toBeInTheDocument();
  });

  it('disables submit button when no changes', () => {
    render(
      <MockedProvider>
        <PostForm post={{ id: '1', title: 'T', content: 'C', author: 'A' }} />
      </MockedProvider>
    );
    expect(screen.getByRole('button', { name: /update post/i })).toBeDisabled();
  });

  it('enables submit button when changes are made', () => {
    render(
      <MockedProvider>
        <PostForm post={{ id: '1', title: 'T', content: 'C', author: 'A' }} />
      </MockedProvider>
    );
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'New Title' } });
    expect(screen.getByRole('button', { name: /update post/i })).not.toBeDisabled();
  });

  it('shows confirmation modal on submit', async () => {
    render(
      <MockedProvider>
        <PostForm {...defaultProps} />
      </MockedProvider>
    );
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'T' } });
    fireEvent.change(screen.getByLabelText(/author/i), { target: { value: 'A' } });
    fireEvent.change(screen.getByLabelText(/content/i), { target: { value: 'C' } });
    fireEvent.click(screen.getByRole('button', { name: /create post/i }));
    expect(await screen.findByText(/are you sure you want to create this post/i)).toBeInTheDocument();
  });

  it('shows error message on mutation failure', async () => {
    // Simulate error by mocking the mutation to throw
    const errorMock = {
      request: {
        query: expect.anything(),
      },
      error: new Error('Failed'),
    };
    render(
      <MockedProvider mocks={[errorMock]} addTypename={false}>
        <PostForm {...defaultProps} />
      </MockedProvider>
    );
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'T' } });
    fireEvent.change(screen.getByLabelText(/author/i), { target: { value: 'A' } });
    fireEvent.change(screen.getByLabelText(/content/i), { target: { value: 'C' } });
    fireEvent.click(screen.getByRole('button', { name: /create post/i }));
    fireEvent.click(await screen.findByRole('button', { name: /create/i }));
    expect(await screen.findByText(/failed to save post/i)).toBeInTheDocument();
  });

  // Leave warning modal and successful create/update flows would require more advanced router mocking and event simulation.
  // These can be added with integration/E2E tests if needed.
}); 