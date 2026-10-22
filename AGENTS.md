<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep self-hosted PHP exports separate from the TanStack application; assemble and test downloadable source in temporary staging so the live app remains unchanged.
- Store gallery metadata in gallery_photos and images in the gallery Storage bucket; public SELECT and role-gated mutations preserve public viewing without public upload access. Sign private-bucket image URLs for display because workspace policy blocks public buckets.
