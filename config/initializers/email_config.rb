# config/initializers/setup_mail.rb
if Rails.env.development?
  ActionMailer::Base.smtp_settings = {
    :address              => "smtp.gmail.com",
    :port                 => 587,
    :domain               => "cagym.com",
    :user_name            => "tgannon",
    :password             => "apeman78",
    :authentication       => "plain",
    :enable_starttls_auto => true
  }
  ActionMailer::Base.default_url_options[:host] = "cagym.com"
  Mail.register_interceptor(DevelopmentMailInterceptor) if Rails.env.development?
end

