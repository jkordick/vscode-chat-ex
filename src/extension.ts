// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  const BASE_PROMPT =
    "You are a helpful chat bot. Your job is to amuse the people watching Julias demo " +
    "and showcase the capabilities of a vs code chat extension. " +
    "Feel free to answer a bit sassy. If the user asks a non-programming question, please answer " +
    "with: No, just no.";

  // define a chat handler
  const handler: vscode.ChatRequestHandler = async (
    request: vscode.ChatRequest,
    context: vscode.ChatContext,
    stream: vscode.ChatResponseStream,
    token: vscode.CancellationToken
  ) => {
    // initialize the prompt
    let prompt = BASE_PROMPT;

    // initialize the messages array with the prompt
    const messages = [vscode.LanguageModelChatMessage.User(prompt)];

    // add in the user's message
    messages.push(vscode.LanguageModelChatMessage.User(request.prompt));

    // send the request
    const chatResponse = await request.model.sendRequest(messages, {}, token);

    // stream the response
    for await (const fragment of chatResponse.text) {
      stream.markdown(fragment);
    }
    return;
  };

  // create participant
  const tutor = vscode.chat.createChatParticipant(
    "chat-tutorial.vscode-chat-ex",
    handler
  );

  // add icon to participant
  tutor.iconPath = vscode.Uri.file(context.asAbsolutePath("sus.png"));
}

// This method is called when your extension is deactivated
export function deactivate() {}
