# J-Core Hub Runtime

## Nguyên tắc

J-Core dùng generative UI dạng khai báo: AI hoặc tool chỉ trả dữ liệu JSON, không trả HTML, CSS hay JavaScript để thực thi. Frontend giữ catalog component đã duyệt và quyết định cách render theo giao diện J-Core.

Thiết kế này dựa trên ba pattern:

- Tool result được ánh xạ sang React component phù hợp.
- UI có vòng đời `loading -> ready | error` và có thể cập nhật dần.
- Payload tách dữ liệu khỏi layout; host app giữ quyền kiểm soát style, accessibility và security.

## Payload đề xuất

```json
{
  "hub": {
    "version": "1.0",
    "kind": "compare",
    "title": "So sánh ba lựa chọn",
    "summary": "Option Alpha phù hợp nhất với tiêu chí hiện tại.",
    "items": [
      {
        "id": "alpha",
        "title": "Option Alpha",
        "description": "Nhanh và ít overhead",
        "meta": "86",
        "url": "https://example.com/alpha",
        "image": "https://example.com/alpha.webp"
      }
    ]
  }
}
```

Frontend chỉ chấp nhận `kind` có trong `HUB_TEMPLATES`. Trường lạ bị bỏ qua; URL chỉ được dùng như link hoặc media source, không được thực thi.

## Catalog hiện tại

- Intelligence: Web, Newsroom, YouTube, Shopping.
- World & Space: Map, Places, Travel, Weather.
- Planning: Mission Board, Calendar, Timeline.
- Data Systems: Dashboard, Chart, Data Grid, Compare.
- Creation Lab: Images, Mind Map, Diagram, Code Lab, Brief.

## Hướng tích hợp tool

1. Model chọn tool theo intent.
2. Tool trả dữ liệu có schema ổn định.
3. Gateway bọc kết quả vào `hub` hoặc `artifacts`.
4. Client mở tab ở trạng thái `loading`.
5. Client hydrate component bằng `items`, sau đó chuyển sang `ready`.
6. Khi nguồn lỗi, các Hub web/map/video/news/shopping/travel/weather chuyển sang nguồn trực tiếp.

## Nguồn tham khảo

- Vercel AI SDK, Generative User Interfaces: https://ai-sdk.dev/docs/ai-sdk-ui/generative-user-interfaces
- Google A2UI: https://developers.googleblog.com/introducing-a2ui-an-open-project-for-agent-driven-interfaces/
- Adaptive Cards schema: https://adaptivecards.io/explorer/
- YouTube Data API search: https://developers.google.com/youtube/v3/docs/search/list
- Google Maps Embed API: https://developers.google.com/maps/documentation/embed/embedding-map
