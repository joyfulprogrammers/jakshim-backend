# 서비스 ERD

작심 서비스 ERD입니다.

## ERD

```mermaid
erDiagram
  users ||--o{ habits : OneToN
  users ||--o{ achievements : OneToN
  users {
    number id
    string email
    string password
    string50 nickname
    string created_at
    string updated_at
    string deleted_at
  }
  habits ||--o{ achievements : OneToN
  habits {
    number id
    number user_id
    string50 name
    string7 theme_color
    string7 font_color
    string icon_image_url
    number target_count
    enum type
    boolean is_important
    boolean cycle_monday
    boolean cycle_tuesday
    boolean cycle_wednesday
    boolean cycle_thursday
    boolean cycle_friday
    boolean cycle_saturday
    boolean cycle_sunday
    boolean cycle_week
    string created_at
    string updated_at
    string deleted_at
  }
  achievements {
    number id
    number habit_id
    number user_id
    number target_count
    enum type
    number count
    string created_at
    string deleted_at
  }
```

## 참고

- [도메인 문서](https://www.notion.so/moonki/80149354666d40eb8b5a72acd0be06a2)
- [다이어그램 툴 mermaid](https://mermaid.js.org/)
