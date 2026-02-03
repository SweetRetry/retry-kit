---
name: fal-ai-model-search
description: Search and integrate Fal AI models. Use when the user wants to (1) search for models on Fal AI platform, (2) get detailed information about a specific Fal AI model, (3) integrate a Fal AI model into the project, or (4) explore available AI models on fal.ai.
---

# Fal AI Model Search & Integration

Guide for searching and integrating Fal AI models from fal.ai platform.

## Workflow

### 1. Search Models

When user wants to find a model, use FetchURL to search:

```
https://fal.ai/explore/search?q=<search-query>
```

**Process:**
1. Parse search results - look for model IDs in format `<namespace>/<model-name>` (e.g., `fal-ai/flux-schnell`, `xai/grok-imagine-image`)
2. Extract: model ID, category (text-to-image, image-to-image, etc.), description
3. Present the found models to the user with:
   - Model name and category
   - Description
   - **Playground link**: `https://fal.ai/models/<full-model-id>` (for xai: `https://fal.ai/models/xai/<model>`; others: `https://fal.ai/models/fal-ai/<model>`)
4. Wait for user confirmation on which model to use

**Important:** The full Model ID format depends on the model namespace:

| Search Result | Full Model ID | API Endpoint |
|---------------|---------------|--------------|
| `xai/grok-imagine-image` | `xai/grok-imagine-image` | `https://fal.run/xai/grok-imagine-image` |
| `bytedance/seedream/v4.5/...` | `fal-ai/bytedance/seedream/v4.5/...` | `https://fal.run/fal-ai/bytedance/seedream/v4.5/...` |
| `flux-1/schnell` | `fal-ai/flux-1/schnell` | `https://fal.run/fal-ai/flux-1/schnell` |

**Rule:** `xai/` models use their ID directly; all others need `fal-ai/` prefix.

### 2. Get Model Details

Once user confirms a model, fetch its detailed information:

**URL Pattern Rules:**

| Model Prefix | llms.txt URL | Playground URL | Full Model ID |
|--------------|--------------|----------------|---------------|
| `xai/` | `https://fal.ai/models/xai/<name>/llms.txt` | `https://fal.ai/models/xai/<name>` | `xai/<name>` |
| Others | `https://fal.ai/models/fal-ai/<id>/llms.txt` | `https://fal.ai/models/fal-ai/<id>` | `fal-ai/<id>` |

**Rule:** If model ID starts with `xai/`, do NOT prepend `fal-ai/`. For all other models, prepend `fal-ai/`.

**Examples:**
- `xai/grok-imagine-image` → llms.txt: `.../models/xai/grok-imagine-image/llms.txt`, Playground: `.../models/xai/grok-imagine-image`
- `bytedance/seedream/v4.5/text-to-image` → llms.txt: `.../models/fal-ai/bytedance/seedream/v4.5/text-to-image/llms.txt`, Playground: `.../models/fal-ai/bytedance/seedream/v4.5/text-to-image`

**When presenting model details to user, always include:**
- Model ID
- **Playground link**: For interactive testing
- **API endpoint**: `https://fal.run/<full-model-id>`
- **Documentation links**: llms.txt, API docs (`https://fal.ai/models/<full-model-id>/api`)

**Process:**
1. Parse the llms.txt content for:
   - Model capabilities and use cases
   - API endpoint and parameters
   - Code examples
   - Pricing information
2. Present the key details to the user
3. Confirm integration approach with user

### 3. Integration Guidelines

When integrating a Fal AI model:

1. **Check existing Fal client setup** in the project
2. **Use the model ID** returned from search (format: `fal-ai/<model-name>`)
3. **Follow the API patterns** shown in the llms.txt examples
4. **Add proper error handling** for API calls

### 4. User Confirmation Points

Always confirm with user at these stages:
- After search results: "Found these models: [list with links]. Which one would you like to use?"
- After model details: "Here are the details for [model] ([playground link]). Shall I proceed with integration?"
- Before code changes: "I'll integrate [model] by [changes]. Does this look correct?"

**Link format for presentation:**
- Use markdown format: `[description](url)`
- Always include the model's playground link so users can test it interactively

## Common Model Patterns

| Model Type | Example IDs | Use Case |
|------------|-------------|----------|
| Text to Image | `fal-ai/flux-schnell`, `xai/grok-imagine-image` | Generate images from text |
| Image to Image | `fal-ai/flux-lora`, `xai/grok-imagine-image/edit` | Transform existing images |
| Video | `fal-ai/ltx-video`, `fal-ai/veo2` | Generate video content |
| Audio | `fal-ai/playht`, `fal-ai/xtts` | Text-to-speech, audio generation |

## Error Handling

- **No search results**: Inform user no models found, suggest alternative search terms
- **Model not found (404)**: 
  - Check if model starts with `xai/` → use `/models/xai/...` URL
  - For other models → use `/models/fal-ai/...` URL
- **llms.txt returns empty**: The model may be deprecated

## Notes

- The `llms.txt` endpoint returns machine-readable documentation optimized for LLMs
- Model IDs can have various prefixes: `fal-ai/`, `xai/`, etc. - always use the full ID from search results
- Always present options to the user before making integration decisions
