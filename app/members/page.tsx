import { redirect } from "next/navigation";

/**
 * 구성원은 교수(/members/professor/)·학생(/members/students/) 두 페이지로 나뉘었다.
 * /members/로 들어오면 교수 페이지로 보낸다. 정적 export라 서버 리다이렉트가 없어서
 * Next가 HTML에 넣어 주는 meta refresh와 클라이언트 라우터가 이동을 맡는다.
 */
export default function MembersPage() {
  redirect("/members/professor/");
}
