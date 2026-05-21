import { contactInfo } from '@/assets/data/contact-us'
import { Separator } from '@/components/ui/separator'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_public-layout/policies')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <section className="prose container mx-auto py-6 px-2 prose-p:text-muted-foreground prose-headings:text-foreground prose-strong:text-foreground">
      <h1 className="text-center">Chính sách</h1>
      <p className="text-muted-foreground text-center">
        Chúng tôi cam kết bảo vệ quyền riêng tư của bạn và tuân thủ các quy định về bảo mật dữ liệu. Chính sách này giải
        thích cách chúng tôi thu thập, sử dụng, lưu trữ và bảo vệ thông tin cá nhân của bạn khi bạn sử dụng dịch vụ của
        chúng tôi.
      </p>
      <h2>Chính sách thuê đồ tại cửa hàng</h2>
      <ol>
        <li>
          <strong>Đặt cọc:</strong> Khách hàng phải đặt cọc trước một khoản tiền nhất định khi thuê đồ. Khoản đặt cọc
          này sẽ được hoàn trả sau khi khách hàng trả lại đồ thuê trong tình trạng tốt.
        </li>
        <li>
          <strong>Trách nhiệm về đồ thuê:</strong> Khách hàng chịu trách nhiệm bảo quản đồ thuê trong suốt thời gian sử
          dụng. Nếu đồ thuê bị hư hỏng hoặc mất mát, khách hàng sẽ phải bồi thường theo giá trị của đồ đó.
        </li>
        <li>
          <strong>Thời gian thuê:</strong> Thời gian thuê được tính từ ngày nhận đồ đến ngày trả lại. Nếu khách hàng trả
          lại muộn, có thể sẽ bị tính phí trễ.
        </li>
        <li>
          <strong>Điều kiện trả lại:</strong> Đồ thuê phải được trả lại trong tình trạng sạch sẽ và không bị hư hỏng.
          Nếu đồ thuê bị bẩn hoặc hư hỏng, khách hàng có thể phải trả thêm phí làm sạch hoặc sửa chữa.
        </li>
      </ol>
      <p>
        Chúng tôi khuyến khích khách hàng đọc kỹ và hiểu rõ các chính sách này trước khi sử dụng dịch vụ của chúng tôi.
      </p>

      <Separator />

      <h2>Câu hỏi ?</h2>
      <p>
        Nếu bạn có bất kỳ câu hỏi nào về chính sách của chúng tôi hoặc cần thêm thông tin, đừng ngần ngại liên hệ với
        chúng tôi để được hỗ trợ. Chúng tôi luôn sẵn sàng giúp đỡ bạn và đảm bảo rằng bạn có trải nghiệm tốt nhất khi sử
        dụng dịch vụ của chúng tôi.
      </p>

      <ul>
        {contactInfo.map((info) => (
          <li key={info.title}>
            <strong>{info.title}:</strong> {info.description}
          </li>
        ))}
      </ul>
    </section>
  )
}
